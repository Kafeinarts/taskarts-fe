<template>
  <div class="about container" data-aos="fade-up">
    <h1 class="display-4 fw-bold text-center">About the Developer</h1>
    <div class="align-item-center">
      <center>
        <hr width="450" />
        <hr width="300" />
        <hr width="150" />
      </center>
    </div>
    <div class="row align-items-center">
      <div class="col-md-4 text-center mb-md-0" data-aos="zoom-in">
        <div class="glass-card">
          <img
            src="https://miro.medium.com/v2/resize:fit:2400/1*99hHL9XJ7EzQeC6RB5_Qiw.jpeg"
            alt="Developer Photo"
            class="img-fluid rounded-circle shadow"
            style="max-width: 250px"
          />
          <h3 class="mt-3">Arif Alexander</h3>
          <p class="text-muted">Founder & Creative of Belajar Bareng</p>
        </div>
      </div>

      <div class="col-md-8" data-aos="fade-left">
        <div class="neo-brutalism-card">
          <p class="lead" style="text-align: justify">
            Arif adalah seorang developer berbakat yang lahir di Jakarta dan
            besar di Depok. Ia adalah pendiri
            <strong><b>Belajar Bareng</b></strong> dan
            <strong><b>Robust Tech Studio</b></strong
            >, dua Komunitas yang bergerak di bidang teknologi kreatif seperti
            <b>web dan app development, network engineering, dan database
              management.
            </b>
          </p>
          <p class="lead" style="text-align: justify">
            Dengan latar belakang pendidikan komputer di Jepang dan Amerika,
            Arif juga aktif menciptakan solusi digital seperti sistem operasi
            untuk laptop lama serta berbagai aplikasi produktivitas. Ia dikenal
            karena pendekatannya yang human-centered dan desain yang elegan.
          </p>
          <p class="lead" style="text-align: justify">
            Di luar dunia IT, Arif adalah musisi indie bergenre jazz dan pop
            yang sering tampil live di Depok. Ia mahir bermain gitar dan piano,
            serta dikenal lewat lagu-lagunya yang heartwarming dan penuh emosi.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism Style */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Neo-Brutalism Style */
.neo-brutalism-card {
  background: #f4f4f4;
  border: 3px solid #000;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 8px 8px 0px #000;
  color: #333;
}

/* General Styling */
.about {
  font-family: 'Poppins', sans-serif;
  color: #333;
}

h1 {
  color: #444;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

hr {
  border: none;
  height: 2px;
  background: linear-gradient(to right, #ff7eb3, #ff758c);
}

.lead {
  font-size: 1.1rem;
  line-height: 1.8;
}
</style>
