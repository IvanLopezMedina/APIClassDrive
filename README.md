<h1><b><u>User endpoints</b></u></h1>
----
  Documentation about the endpoints from users.

  Index:
  * Get User
  * Update User
  * Delete User
  * Signup
  * Signin

**Get User**
----
  Returns json data about a single user.

* **URL**

  /users/:userId

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `userId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ user }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `The user doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error retrieving data: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/users/5cb0d7e441d9d342d4aab961",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
**Update User**
----
  Updates a single user.

* **URL**

  /users/:userId

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `userId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ user: userUpdated }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `The user doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error updating user: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/users/5cb0d7e441d9d342d4aab961",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
  **Delete User**
----
  Drops from the database a single user.

* **URL**

  /users/:userId

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `userId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: `The user has been deleted successfully `}`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `The user doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error deleting the user: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/users/5cb0d7e441d9d342d4aab961",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
**Signup**
----
  Registers a user and generates a login token.

* **URL**

  /users/signup/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  `name = String` <br />
  `lastname = String` <br />
  `email = String` <br>
  `displayname = String` <br />
  `password = String` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ msg: SignUp successfull }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ msg: `The user doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ msg: `${error} ya existe. Utilice otro ${error}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/users/signup",
      dataType: "json",
      type : "POST",
      body: {
        name = "Ivan"
        lastname = "López"
        email = "ivan.lopez.medina.ilm@gmail.com"
        displayname = "IvanLopez"
        password = "12345678"
      }
      success : function(r) {
        console.log(r);
      }
    });
  ```

----
**Signin**
----
  Registers a user and generates a login token.

* **URL**

  /users/signin/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

  `email = String` <br>
  `password = String` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ `msg: `Login succesfull`, user, token: service.createToken(user)` })`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ msg: `The user doesn't exist: ${req.body.email}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ msg: `SignIn error: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/users/signin",
      dataType: "json",
      type : "POST",
      body: {
        email = "ivan.lopez.medina.ilm@gmail.com"
        password = "12345678"
      }
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
<h1><b><u>Tests endpoints</b></u></h1>
----
  Documentation about the endpoints from tests.

  Index:
  * Add Test
  * Get AllTests
  * Get Test
  * Edit Test
  * Delete Test

**Add Test**
----
  Add a new test

* **URL**

  /tests/addtest

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `name`

* **Data Params**

  `name = String` <br />
  `groupName = String` <br />
  `question = String` <br>
  `answer = [String]` <br />
  `correctAnswer = [String]` <br />
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ msg: Test added successfully }`
 
* **Error Response:**
  * **Code:** 409 CONFLICT <br />
    **Content:** `{ msg: `${error} ya existe. Utilice otro ${error}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tests/addtest",
      dataType: "json",
      type : "POST",
      body: {
        name = "Test_1"
        groupName = "GDS"
        question = "Esta asignatura es una mierda?"
        answer = "[si, no]"
        correctAnswer = "[si]"
      }
      success : function(r) {
        console.log(r);
      }
    });
  ```
----

**Get AllTests**
----
  Returns json data about all tests from a specific group.

* **URL**

  /tests/alltests/:groupName

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `groupName= String `

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ tests }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `The test doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error retrieving data: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tests/alltests/GDS",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----

**Get Test**
----
  Returns json data about a single tests.

* **URL**

  /tests/test/:testId

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `testId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ test }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `The test doesn't exist: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error retrieving data: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tests/test/5cb374fe423b1a4150067f63",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
**Edit Test**
----
  Edit/Update a single test.

* **URL**

  /tests/edittest/:userId

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `testId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ test: testUpdated }`
 
* **Error Response:**

  * **Code:** 404 CONFLICT <br />
    **Content:** `{ message: `Error updating test: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tests/edittest/5cb4c80090db6e23d828b15c",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
  **Delete Test**
----
  Drops from the database a single test.

* **URL**

  /tests/deletetest/:testId

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `testId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: `The test has been deleted successfully `}`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message: `Test not found`: ${err}` }`

  OR

  * **Code:** 409 CONFLICT <br />
    **Content:** `{ message: `Error deleting the test: ${err}` }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/api/tests/deletetest/5cb4c80090db6e23d828b15c",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
<h1><b><u>Forum endpoints</b></u></h1>
----
Documentation about the endpoints from forum.

  Index:
  * Get Posts
  * Get Post
  * Add Post
  * Update Forum
  * Add Answer
  * Delete Forum Element

**getPosts**
----
  Returns json data of all posts in a specific forum.

* **URL**

  /posts/:forumId

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `forumId=[ObjectId]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ posts: posts}`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum doesn't exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/posts/5cb5f786cd0dca3e1cd4233a",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
----
**getPost**
----
  Returns json data of a unique post.

* **URL**

  /post/:postId

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `postId=[ObjectId]`

* **Data Params**
   **Required:**

   `forumId=[ObjectId]`
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ post: post }`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum doesn't exist" }`

  OR
  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Post doesn't exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/post/5cb5f8e60005de1cec65e64d",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

  ----
**addPost**
----
  Creates one or more posts.

* **URL**

  /addPost/:groupName

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `groupName=String`

* **Data Params**
   **Required:**

   `posts=[Post]` <br />
   `title = String` <br />
   `author = String` <br />
   
  
   **Optional**

   `date = Date` <br />
   `likes = Number` <br />
   `dislikes = Number` <br />
   `userFavs = [ObjectId]` <br />
   `answers = [Answer]` <br />
   `answer = String` <br />


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ forum: forum }`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum doesn't exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error creating post:" }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/addPost/grup",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

----
**updateForum**
----
  Updates a single forum.

* **URL**

  /updateForum/:groupName

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `groupName=String`

* **Data Params**
   **Required:**

   `posts=[Post]` 
  
   **Optional**

   `groupName = String` <br />
   `title = String` <br />
   `author = String` <br />
   `date = Date` <br />
   `likes = Number` <br />
   `dislikes = Number` <br />
   `userFavs = [ObjectId]` <br />
   `answers = [Answer]` <br />
   `answer = String` <br />


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ forum: forum }`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum doesn't exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/updateForum/grup",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

----
**addAnswer**
----
  Adds an answer to a specific post.

* **URL**

  /addAnswer/:groupName

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `groupName=String`

* **Data Params**
   **Required:**

   `postId=[ObjectId]` <br />
  
   **Optional**
   
   `answer = String` <br />
   `author = String` <br />
   `date = Date` <br />
   `likes = Number` <br />
   `dislikes = Number` <br />
   

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ forum: forum }`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum doesn't exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`

 OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error creating answer" }`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/addAnswer/grup",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

----
**deleteForumElement**
----
  Deletes a Post or Answer from a single Forum.

* **URL**

  /deleteForumElement/:groupName

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `groupName=String`

* **Data Params**
   **Required:**

   `idToDelete = ObjectId` <br />
  
   **Optional**
   `postId = ObjectId` <br />
   

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: 'Post deleted correctly' }`

  OR

   * **Code:** 200 <br />
    **Content:** `{ message: 'Answer deleted correctly' }`
 
* **Error Response:**

  * **Code:** 404 Not Found <br />
    **Content:** `{ message:  "Forum does not exist" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error retrieving data" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error deleting post" }`

  OR

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ message : "Error deleting answer" }`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/deleteForumElement/grup",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```
