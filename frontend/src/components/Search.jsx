import {
  Avatar,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

const Search = () => {
  const [query, setQuery] = useState("");
  const [originalQuery, setOriginalQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const request = useApi();

  const requestCounterRef = useRef(0);
  const timeoutRef = useRef(null);

  const inputWidth = useBreakpointValue({
    base: "100%",
    md: isFocused ? "300px" : "200px",
  });

  const handleQuery = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && searchedUsers[selectedIndex]) {
        handleUserSelect(searchedUsers[selectedIndex]);
      } else if (originalQuery.trim()) {
        navigate(`/${originalQuery.trim()}`);
        resetSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchedUsers.length > 0) {
        setSelectedIndex((prev) => {
          const newIndex = prev < searchedUsers.length - 1 ? prev + 1 : -1;

          if (newIndex === -1) {
            setQuery(originalQuery);
          } else {
            setQuery(searchedUsers[newIndex].username);
          }

          return newIndex;
        });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchedUsers.length > 0) {
        setSelectedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : -1;

          if (newIndex === -1) {
            setQuery(originalQuery);
          } else {
            setQuery(searchedUsers[newIndex].username);
          }

          return newIndex;
        });
      }
    } else if (e.key === "Escape") {
      setSelectedIndex(-1);
      setQuery(originalQuery);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const resetSearch = () => {
    setQuery("");
    setOriginalQuery("");
    setIsFocused(false);
    setSearchedUsers([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleUserSelect = (user) => {
    navigate(`/${user.username}`);
    resetSearch();
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOriginalQuery(val);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [originalQuery]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const searchQuery = originalQuery.trim();

    if (!searchQuery) {
      setSearchedUsers([]);
      setSelectedIndex(-1);
      return;
    }

    requestCounterRef.current += 1;
    const currentRequestId = requestCounterRef.current;

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await request(`/users/searchUser?query=${searchQuery}`);

        // stale
        if (currentRequestId === requestCounterRef.current) {
          if (!data) {
            setSearchedUsers([]);
            return;
          }
          setSearchedUsers(data);
        }
      } catch {
        if (currentRequestId === requestCounterRef.current) {
          setSearchedUsers([]);
        }
      }
    }, 300); // debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [originalQuery]);

  return (
    <Flex my={4} justify="center" position="relative">
      <InputGroup w={inputWidth} transition="width 0.2s ease">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          ref={inputRef}
          placeholder="Search for a user..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
              if (inputRef.current.val) setQuery(originalQuery);
              setSelectedIndex(-1);
            }, 150);
          }}
          borderRadius="md"
          bg="gray.900"
          color="white"
        />
      </InputGroup>

      {searchedUsers.length > 0 && isFocused && (
        <Stack
          w={inputWidth}
          position="absolute"
          top="50px"
          bg="gray.800"
          padding="10px 10px"
          zIndex={100}
          boxShadow="md"
          borderRadius="md"
        >
          {searchedUsers.map((user, i) => (
            <Flex
              key={user._id || i}
              gap={4}
              align="center"
              py={2}
              px={2}
              cursor="pointer"
              bg={selectedIndex === i ? "gray.600" : "transparent"}
              _active={{ bg: selectedIndex === i ? "gray.600" : "gray.700" }}
              onMouseEnter={() => {
                setSelectedIndex(i);
                setQuery(user.username);
              }}
              onMouseLeave={() => {
                if (selectedIndex === i) {
                  setSelectedIndex(-1);
                  setQuery(originalQuery);
                }
              }}
              onMouseDown={() => handleUserSelect(user)}
            >
              <Avatar size="sm" src={user.profilePic} name={user.username} />
              <Text color="white">{user.username}</Text>
            </Flex>
          ))}
        </Stack>
      )}
    </Flex>
  );
};

export default Search;
