# Backend and JS Project

This project is a backend application built using Node.js, Express.js, and MongoDB. It includes features like user authentication, file uploads, database interactions, and API development. Below is a detailed breakdown of the concepts, technologies, and logic implemented in this project.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Model Link](#model-link)
3. [HTTP Concepts](#http-concepts)
4. [CORS](#cors)
5. [HTTP Methods](#http-methods)
6. [HTTP Status Codes](#http-status-codes)
7. [Summary](#summary)
8. [Detailed Features](#detailed-features)

---

## Project Overview

This backend project is designed to handle user management, video uploads, and subscriptions. It uses **Express.js** for routing, **MongoDB** for data storage, and **Mongoose** for database modeling. The project also integrates **Cloudinary** for file uploads and **JWT** for secure authentication.

---

## Model Link

The database schema is visualized using [dbdiagram.io](https://dbdiagram.io/d/videotube-67c81491263d6cf9a0485986). This provides a clear representation of the relationships between different entities in the database.

---

## HTTP Concepts

### HTTP (Hyper Text Transfer Protocol)
HTTP is the foundation of data communication on the web. It is a stateless protocol used to transfer data between a client and a server.

### HTTP Headers
Headers are metadata sent along with HTTP requests and responses. They are key-value pairs that provide additional information about the request or response.

#### Types of Headers:
1. **Request Headers (Client)**: Sent by the client to provide information about the request.
2. **Response Headers (Server)**: Sent by the server to provide information about the response.
3. **Representation Headers**: Define how the data is encoded or compressed.
4. **Payload Headers**: Contain information about the data being sent.

#### Common HTTP Headers:
- **Accept**: Specifies the media types the client can handle (e.g., `application/json`, `text/html`).
- **User-Agent**: Identifies the client software making the request.
- **Authorization**: Contains credentials for authentication (e.g., `Bearer JWT_TOKEN`).
- **Content-Type**: Indicates the media type of the resource (e.g., `application/json`).
- **Cookie**: Contains stored cookies sent by the client.
- **Cache-Control**: Directives for caching mechanisms.

### X-Prefix Headers
Introduced in 2012, these headers provide additional security:
- **X-Frame-Options**: Prevents clickjacking attacks.
- **X-XSS-Protection**: Enables cross-site scripting protection.
- **X-Content-Type-Options**: Prevents MIME type sniffing.
- **X-Content-Security-Policy**: Defines content security policies.

---

## CORS

Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain. Key headers include:
- **Access-Control-Allow-Origin**: Specifies the allowed origin(s).
- **Access-Control-Allow-Credentials**: Indicates whether credentials are allowed.
- **Access-Control-Allow-Methods**: Lists the HTTP methods allowed for cross-origin requests.

---

## HTTP Methods

HTTP methods define the type of operation to be performed on a resource. Common methods include:

- **GET**: Retrieve a resource.
- **HEAD**: Retrieve headers without the message body.
- **OPTIONS**: Describe the communication options for the target resource.
- **TRACE**: Perform a loopback test.
- **DELETE**: Remove a resource.
- **PUT**: Replace a resource.
- **PATCH**: Update part of a resource.
- **POST**: Create or interact with a resource.

---

## HTTP Status Codes

HTTP status codes indicate the result of an HTTP request. They are grouped into five categories:

- **1xx (Informational)**: Request received, continuing process.
  - `100 Continue`
  - `102 Processing`
- **2xx (Success)**: The request was successfully received, understood, and accepted.
  - `200 OK`
  - `201 Created`
  - `202 Accepted`
- **3xx (Redirection)**: Further action needs to be taken to complete the request.
  - `307 Temporary Redirect`
  - `308 Permanent Redirect`
- **4xx (Client Error)**: The request contains bad syntax or cannot be fulfilled.
  - `400 Bad Request`
  - `401 Unauthorized`
  - `402 Payment Required`
  - `404 Not Found`
- **5xx (Server Error)**: The server failed to fulfill a valid request.
  - `500 Internal Server Error`
  - `504 Gateway Timeout`

---

## Summary

### Key Features:
- **Environment Variables**: Securely manage sensitive information.
- **Package.json**: Lists dependencies and their usage.
- **Database Connection**: Establishes a connection to MongoDB.
- **Index.js**: Sets up the application, including routing, cookie parsing, and API versioning.
- **Models**: Define database schemas and include hooks for pre-processing data.
- **Controllers**: Handle business logic for various operations.
- **Aggregation Pipelines**: Perform complex queries using MongoDB's `$lookup`, `$match`, `$addFields`, and `$pipeline`.
- **File Uploads**: Use Multer for handling file uploads and Cloudinary for cloud storage.
- **Database Queries**: Perform CRUD operations using Mongoose (`find`, `findById`, `findOne`).
- **Tokens**: Manage access and refresh tokens for authentication.
- **Middlewares**: Include authentication, file upload handling, and error handling.
- **File Management**: Organize and manage static and temporary files.

---

## Detailed Features

### Environment Variables
Environment variables are stored in a `.env` file to manage sensitive information securely. Key variables include:
- `PORT`: The port on which the server runs.
- `MONGODB_URI`: MongoDB connection string.
- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`: Secrets for JWT token generation.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for Cloudinary integration.

### Models
- **User Model**: Includes fields for `username`, `email`, `password`, and methods for password hashing and token generation.
- **Video Model**: Includes fields for `videoFile`, `thumbnail`, `title`, and `owner`.
- **Subscription Model**: Tracks relationships between subscribers and channels.

### Controllers
- **User Controller**: Handles user registration, login, logout, and profile updates.
- **Video Controller**: Manages video uploads and metadata.

### Middlewares
- **Authentication Middleware**: Verifies JWT tokens.
- **Multer Middleware**: Handles file uploads.

### Aggregation Pipelines
MongoDB aggregation pipelines are used for advanced queries, such as fetching user watch history and channel profiles.

Example:
```js
const channel = await User.aggregate([
  { $match: { username: username.toLowerCase() } },
  { $lookup: { from: 'subscriptions', localField: '_id', foreignField: 'channel', as: 'subscribers' } },
  { $addFields: { subscribersCount: { $size: '$subscribers' } } }
]);