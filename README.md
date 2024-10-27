# blog - a first microservice app

This app was built in Stephen Grider's udemy course [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react).

## my changes

I made the following changes:

- I hide the content of non approved comments (there fore I've added a property publicContent, which is blank if the status of the comment is not approved).
- I've added the possibility to moderate comments (if they contain the word 'blue').
  - orange is rejected by default by the moderation service.
  - all other comments (neither containing blue or orange) are approved by the moderation service.
