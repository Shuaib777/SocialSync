features that i have implemented:

    loginPage / logoutPage
    profilePage -> can update profile here name, email, image, etc...
    createPost -> can create a post
    UserPage -> who they are following like that and other users info
    homePageFeed

features that I have to implememnt:

    UserPost -> Like, Comment
    Also i need to make sure that in UserPage the currentUser can delete and update(optional) its post
    chatIntegration(probably for one to one msg using socket or firebase)
    ...some other ideas

some small integration:

    update date posted in the post page also on the user post component
    I will add reply to the replies later
    in whatever page i am rerender that page after the post is created

the overview of this app:

    Backend:
        The apis are self explanatory.

    Frontend:
        for global variables such as user data I am using atom(by facebook) which by default fetch from localStorage
        for fetch i have created a custom use api and inside declared a function request which basically fetches

        Auth page:
            has some basic form and it takes name, username, email, pass
            after successfull authentication, store the user data in localStorage,
            set the global user and navigate to the home page

        User page:
            It has User Header:
                which basically shows info about the user that is passed to the params
                it has a follow and unfollow button for that i have written some logic that will
                call an api for follow and unfollow and to avoid updating the currentUsers followers list
                and profileUser following list i have updated the states only
                this will fetch two apis "/profile/:username" and "/followUnfollow/:id"
            It has then User Post: // not completed yet
                It has functionality like like, reply
                on clicking it, it goes to seperate page PostPage
                this will fetch some of this apis:
                     "/getUserPosts/:userId"
                     "/likeUnlike/:postId"
            PostPage:
                It is a complete description of the post with Comments too
                This will fetch this apis:
                    "/getPosts/:postId"
                    "/likeUnlike/:postId"
                    "/reply/:postId"

            hierarchy -> UserPage -> UserHeader / UserPost -> PostPage -> comment

        ProfilePage:
            this page is for changing the profile of the user
            it uses formData to collect the data like name, email, pic
            since i have used multer for pic i have used formData
            the pic of a user is going to the cloudinary
            this fetches "/api/users/update"

        CreatePost:
            this is component to see the posted image immediately i have created the usePreviewImage hook
            and to the send the image to the cloudinary i have used multer
            this fetches "/posts/createPost"

        HomePage:
            loops through all the post that the current user is following to
            this fetches "/posts/getFeed"
