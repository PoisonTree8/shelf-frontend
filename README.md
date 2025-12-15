 
 
                                        USER:
         _____________________________________________________________________________
        | field               type                                                    |
        |_____________________________________________________________________________|
        | _id                 objectId                                                |
        | username            string          required: true  unique: true            |
        | email               string          required: true  unique: true            |
        | hashedPassword      string          required: true                          |
        | role                string          required: true  {enum: user, admin}     |
        |_____________________________________________________________________________|



                                     Book
         _____________________________________________________________________________
        | field               type                    options                         |
        |_____________________________________________________________________________|
        | _id                 objectId                                                |
        | title               string                  required: true                  |
        | description         string                  required: true                  |
        | price               number                  required: true  min: 0          |
        | authorName          string                  required: true                  |
        | previewPdfUrl       string                  required: true                  |
        | fullPdfUrl          string                  required: true                  |
        | coverImageUrl       string                  required: true                  |
        |_____________________________________________________________________________|


         _____________________________________________________________________________
        | field               type                    options                         |
        |_____________________________________________________________________________|
        | _id                 objectId                                                |
        | ratingValue         number                  required: true  min:1 max:5     |
        | user_id             objectId                required: true  ref: User       |
        | book_id             objectId                required: true  ref: Book       |
        |                                                                             |
        |_____________________________________________________________________________|



USER STORIES:
* As a guest, I want to browse books so I can explore what is available.
* As a guest, I want to read a free preview (first chapter) so I can decide before buying.
* As a user, I want to sign up and sign in so I can purchase books and rate them.
* As a user, I want to purchase a book so I can access the full PDF on the platform.
* As an authenticated user, I want to rate books (1–5 stars) so I can share feedback.
* As a user, I want to see the average rating for each book so I can choose better books.
* As an admin, I want to add, edit, and delete books so I can manage the catalog.
* As a user, I want the site to be easy to navigate so I can find books quickly.
* As a user, I want my data to be secure so only I can edit my rating/purchases.



Project Description

Shelf is a web application for browsing and purchasing digital books (PDF).
Users can preview the first chapter for free, then purchase to unlock full access on the platform.
Authenticated users can rate books from 1 to 5 stars, and the average rating is displayed to help users discover better books. Admins can manage the book catalog by adding and updating books and uploading preview/full PDF files.



Technologies Used:
React (Frontend)
Express.js / Node.js (Backend)
MongoDB + Mongoose (Database)
JWT Authentication
