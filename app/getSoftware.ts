type Software = {
    id :number,  
        title :string,
        github_url :string,
        description :string,
        main_image :string
      
  }

async function getSoftware() {
    const response = await fetch("http://localhost:3000/api/Software");
    const movies = await response.json();
    console.log(movies);
    var software: Software[] = [];
    return movies;
  }

  export default getSoftware;