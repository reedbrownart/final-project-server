Hello! Welcome to the server side repository for the GIF GALLERY.

GIF Gallery is a public art gallery where anyone can submit work.

You're the cream of the crop, and the cream ALWAYS rises.

This database structure connects three models each with their own controller.

It implements Express, Node, and Sequelize.

The User model and controller are used to create, update (make admin), delete, and retrieve user information.

The Art model and controller are used to create, update, delete, and retrieve art creations by the user.

Each creation consists of an array which contains an array of Gifs, an array of Animation Filters, and an array of Animation speeds. The creation also contains a title and a link to audio which is embedded into the creation.

The Review model and controller are used to create, update, delete, and retrieve reviews which are posted by users about other creations.

Each review contains a Rating from 1-10 and a description.

By using table association, each piece of Art is associated with a user when it is created. Additionally each review is associated with BOTH a piece of art and the user that wrote the review.