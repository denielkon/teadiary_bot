create TABLE stateReview(
   id SERIAL PRIMARY KEY,
   userID INTEGER,
   autorName VARCHAR(255),
   teaName VARCHAR(255),
   isTea INTEGER,
   rating INTEGER,
   teaDescription VARCHAR(255)
);
create TABLE stateRating(
   id SERIAL PRIMARY KEY,
   teaName VARCHAR(255),
   rating INTEGER,
   reviewTimes INTEGER
);
create TABLE users(
   id SERIAL PRIMARY KEY,
   teaName VARCHAR(255),
   userID INTEGER,
   newTea INTEGER,
   FOREIGN KEY (newTea) REFERENCES newTea (id)
);
create TABLE newTea(
   id SERIAL PRIMARY KEY,
   userID INTEGER,
   autorName VARCHAR(255),
   teaName VARCHAR(255),
   isTea INTEGER,
   rating INTEGER,
   teaDescription VARCHAR(255)
);