import type { Project } from "@/src/@types/components";
import type { UploadsFile } from "@/src/@types/database";
import { getNormalFile } from "./objects";

export function projectsConverter(projects: UploadsFile[]): Project[] {
  let tempImages: UploadsFile[] = [];
  const finalProjects: Project[] = [];

  for (const project of projects.toSorted((a, b) => a.index - b.index)) {
    tempImages.push(project);

    if (tempImages.length === 2) {
      const [beforeImage, afterImage] = tempImages as [
        UploadsFile,
        UploadsFile
      ];

      const { metadata: { title, description } = {} } = getNormalFile(
        beforeImage,
        true
      );

      const projectData: Project = {
        index: finalProjects.length,
        beforeImage,
        afterImage,
        title: title ?? "",
        details: description ?? "",
      };
      finalProjects.push(projectData);
      tempImages = [];
    }
  }

  return finalProjects;
}
