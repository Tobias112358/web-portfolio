type Project = {
    id :number,  
    title :string,
    project_link :string,
    description :string,
    main_image :string,
    link_label :string,
    color :string,
  }

async function getProjects(): Promise<Project[]> {
    const response = await fetch("http://localhost:3000/api/Projects");
    const responseJson = await response.json();
    console.log(responseJson);
    var projectArray: Project[] = [];

    for(var i = 0; i<responseJson.length; i++) {
      projectArray.push(responseJson[i])
    }

    return projectArray;
  }

  export default getProjects;
  export type {Project};