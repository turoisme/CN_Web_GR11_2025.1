require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');
const Director = require('./models/Director');
const Actor = require('./models/Actor');

const movies = [
  {
    title: "The Shawshank Redemption",
    originalTitle: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    duration: 142,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    genres: ["Drama", "Crime"],
    directors: ["Frank Darabont"],
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
  },
  {
    title: "The Godfather",
    originalTitle: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    duration: 175,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    genres: ["Drama", "Crime"],
    directors: ["Francis Ford Coppola"],
    actors: ["Marlon Brando", "Al Pacino", "James Caan"]
  },
  {
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    releaseYear: 2008,
    duration: 152,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    genres: ["Action", "Crime", "Drama"],
    directors: ["Christopher Nolan"],
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    duration: 154,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    genres: ["Crime", "Drama"],
    directors: ["Quentin Tarantino"],
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"]
  },
  {
    title: "Forrest Gump",
    originalTitle: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
    releaseYear: 1994,
    duration: 142,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/wAz2RAUH5eLXVEfxWlMt8okjY0N.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
    genres: ["Drama", "Romance"],
    directors: ["Robert Zemeckis"],
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"]
  },
  {
    title: "Inception",
    originalTitle: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    duration: 148,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    genres: ["Action", "Science Fiction", "Adventure"],
    directors: ["Christopher Nolan"],
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
  },
  {
    title: "The Matrix",
    originalTitle: "The Matrix",
    description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    duration: 136,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    genres: ["Action", "Science Fiction"],
    directors: ["Lana Wachowski", "Lilly Wachowski"],
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  {
    title: "Interstellar",
    originalTitle: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    duration: 169,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    genres: ["Adventure", "Drama", "Science Fiction"],
    directors: ["Christopher Nolan"],
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
  },
  {
    title: "Gladiator",
    originalTitle: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    duration: 155,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=owK1qxDselE",
    genres: ["Action", "Drama", "Adventure"],
    directors: ["Ridley Scott"],
    actors: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"]
  },
  {
    title: "The Prestige",
    originalTitle: "The Prestige",
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    releaseYear: 2006,
    duration: 130,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/bdN3gXuIZYaJP7ftJUrilScCrDT.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=o4gHCmTQDVI",
    genres: ["Drama", "Mystery", "Science Fiction"],
    directors: ["Christopher Nolan"],
    actors: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"]
  },
  {
    title: "The Lion King",
    originalTitle: "The Lion King",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    releaseYear: 1994,
    duration: 88,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/1TzoKdI3mOKxsPQwh6nNKkJJ5H5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=7TavVZMewpY",
    genres: ["Animation", "Family", "Drama"],
    directors: ["Roger Allers", "Rob Minkoff"],
    actors: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"]
  },
  {
    title: "Saving Private Ryan",
    originalTitle: "Saving Private Ryan",
    description: "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.",
    releaseYear: 1998,
    duration: 169,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/uqx37vjvh6TKuHXYmUXYHe8FnzF.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/k4CXnZaJXVF4M0D4zRqKNhL9fWH.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=9CiW_DgxCnQ",
    genres: ["Drama", "War", "History"],
    directors: ["Steven Spielberg"],
    actors: ["Tom Hanks", "Matt Damon", "Tom Sizemore"]
  },
  {
    title: "The Green Mile",
    originalTitle: "The Green Mile",
    description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
    releaseYear: 1999,
    duration: 189,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Ki4haFrqSrw",
    genres: ["Fantasy", "Drama", "Crime"],
    directors: ["Frank Darabont"],
    actors: ["Tom Hanks", "Michael Clarke Duncan", "David Morse"]
  },
  {
    title: "Parasite",
    originalTitle: "기생충",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    duration: 133,
    country: "South Korea",
    language: "Korean",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    genres: ["Comedy", "Thriller", "Drama"],
    directors: ["Bong Joon-ho"],
    actors: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"]
  },
  {
    title: "Whiplash",
    originalTitle: "Whiplash",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
    releaseYear: 2014,
    duration: 107,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=7d_jQycdQGo",
    genres: ["Drama", "Music"],
    directors: ["Damien Chazelle"],
    actors: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"]
  },
  {
    title: "The Departed",
    originalTitle: "The Departed",
    description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    releaseYear: 2006,
    duration: 151,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/8Od5zV93Av1W7WZAHfdezHJBVLW.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=SGWvwjZ0eDc",
    genres: ["Drama", "Thriller", "Crime"],
    directors: ["Martin Scorsese"],
    actors: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"]
  },
  {
    title: "The Pianist",
    originalTitle: "The Pianist",
    description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.",
    releaseYear: 2002,
    duration: 150,
    country: "France",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/ctjEj2xM32OvBXCq8zAdK3ZrsAj.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=BFwGqLa_oAo",
    genres: ["Drama", "War"],
    directors: ["Roman Polanski"],
    actors: ["Adrien Brody", "Thomas Kretschmann", "Frank Finlay"]
  },
  {
    title: "Coco",
    originalTitle: "Coco",
    description: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather.",
    releaseYear: 2017,
    duration: 105,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Ga6RYejo6Hk",
    genres: ["Animation", "Family", "Fantasy"],
    directors: ["Lee Unkrich", "Adrian Molina"],
    actors: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"]
  },
  {
    title: "Django Unchained",
    originalTitle: "Django Unchained",
    description: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    releaseYear: 2012,
    duration: 165,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=eUdM9vrCbow",
    genres: ["Drama", "Western"],
    directors: ["Quentin Tarantino"],
    actors: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"]
  },
  {
    title: "WALL·E",
    originalTitle: "WALL·E",
    description: "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    releaseYear: 2008,
    duration: 98,
    country: "USA",
    language: "English",
    posterUrl: "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    backgroundUrl: "https://image.tmdb.org/t/p/original/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=CZ1CATNbXg0",
    genres: ["Animation", "Family", "Science Fiction"],
    directors: ["Andrew Stanton"],
    actors: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"]
  }
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get or create admin user
    const User = require('./models/User');
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne({ email: 'admin1@filmrate.com' });
    }

    if (!admin) {
      console.log('⚠️  No admin user found. Creating one...');
      admin = await User.create({
        username: 'admin',
        email: 'admin@filmrate.com',
        password: 'Admin123@',
        role: 'admin'
      });
    }

    console.log(`👤 Using admin: ${admin.username} (${admin.email})\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const movieData of movies) {
      // Check if movie already exists
      const existingMovie = await Movie.findOne({ title: movieData.title });
      if (existingMovie) {
        console.log(`⚠️  "${movieData.title}" already exists, skipping...`);
        skipCount++;
        continue;
      }

      // Get or create genres
      const genreIds = [];
      for (const genreName of movieData.genres) {
        let genre = await Genre.findOne({ name: genreName });
        if (!genre) {
          genre = await Genre.create({ name: genreName });
        }
        genreIds.push(genre._id);
      }

      // Get or create directors
      const directorIds = [];
      for (const directorName of movieData.directors) {
        let director = await Director.findOne({ name: directorName });
        if (!director) {
          director = await Director.create({ name: directorName });
        }
        directorIds.push(director._id);
      }

      // Get or create actors
      const actorIds = [];
      for (const actorName of movieData.actors) {
        let actor = await Actor.findOne({ name: actorName });
        if (!actor) {
          actor = await Actor.create({ name: actorName });
        }
        actorIds.push(actor._id);
      }

      // Create movie
      const movie = await Movie.create({
        title: movieData.title,
        originalTitle: movieData.originalTitle,
        description: movieData.description,
        releaseYear: movieData.releaseYear,
        duration: movieData.duration,
        country: movieData.country,
        language: movieData.language,
        posterUrl: movieData.posterUrl,
        backgroundUrl: movieData.backgroundUrl,
        trailerUrl: movieData.trailerUrl,
        genres: genreIds,
        directors: directorIds,
        actors: actorIds,
        createdBy: admin._id,
        isActive: true
      });

      console.log(`✅ Created: "${movie.title}" (${movie.releaseYear})`);
      successCount++;
    }

    console.log(`\n🎉 Movie seeding completed!`);
    console.log(`   ✅ Created: ${successCount} movies`);
    console.log(`   ⚠️  Skipped: ${skipCount} movies (already exist)`);
    console.log(`   📊 Total: ${successCount + skipCount} movies processed\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedMovies();
