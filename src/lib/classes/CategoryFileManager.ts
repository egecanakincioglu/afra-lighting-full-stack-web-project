import type {
  UpdateFilesInput,
  UpdateFilesPostInput,
  UpdateFilesReturn,
  UploadsFile,
} from "@/src/@types/database";
import {
  deleteUploadsFile,
  getUploadsCategories,
  patchUploadsFiles,
  postUploadsFiles,
} from "../helpers/api";
import { isString } from "../helpers/verifications";
import type {
  UploadsFilePatchSchema,
  UploadsFilePostSchema,
} from "@/src/modules/api/schemas";
import type { CategoryFileManagerOptions } from "@/src/@types/components";

export class CategoryFileManager {
  private files: UploadsFile[];
  private category: string;
  private _updateState?: React.Dispatch<React.SetStateAction<UploadsFile[]>>;

  constructor(options: CategoryFileManagerOptions) {
    const { category, files, updateState } = options;

    this.category = category;
    this.files = files ?? [];

    if (updateState) {
      this._updateState = updateState;
    }
  }

  private updateState(): void {
    if (this._updateState) {
      this._updateState(this.files);
    }
  }

  public setFiles(files: UploadsFile[], update = true): void {
    this.files = files;
    if (update) this.updateState();
  }

  public getFiles(): UploadsFile[] {
    return this.files;
  }

  public async retrieveFiles() {
    const category = this.category;
    const requestResult = await getUploadsCategories(category);
    const retrievedCategory =
      requestResult[category as keyof typeof requestResult];
    this.setFiles(retrievedCategory);
  }

  public async delete(
    file: UploadsFile | string,
    update = true
  ): Promise<UploadsFile[] | string> {
    const id = isString(file) ? file : file.id;
    const result = await deleteUploadsFile(id);

    if (isString(result)) return result;

    const newFiles = this.files.filter((file) => file.id !== id);
    this.setFiles(newFiles, update);
    return newFiles;
  }

  public async post(
    files: UpdateFilesPostInput[],
    update = true
  ): Promise<UploadsFile[] | string> {
    const mappedFiles = files.map((file) => ({
      ...file,
      category: this.category,
    })) as UploadsFilePostSchema[];

    const result = await postUploadsFiles(mappedFiles);

    if (isString(result)) return result;

    const { files: allFiles } = result;
    const sameCategoryFiles = allFiles.filter(
      (file) => file.category === this.category
    );

    this.setFiles(sameCategoryFiles, update);
    return sameCategoryFiles;
  }

  public async patch(
    files: UploadsFilePatchSchema[],
    update = true
  ): Promise<UploadsFile[] | string> {
    const result = await patchUploadsFiles(files);

    if (isString(result)) return result;

    const { files: allFiles } = result;
    const sameCategoryFiles = allFiles.filter(
      (file) => file.category === this.category
    );

    this.setFiles(sameCategoryFiles, update);
    return sameCategoryFiles;
  }

  public async updateFiles(
    files: UpdateFilesInput[]
  ): Promise<UpdateFilesReturn> {
    const mappedFiles = files.map((file) => ({
      ...file,
      category: this.category,
    }));

    const newFiles: UploadsFilePostSchema[] = [];
    const updatedFiles: UploadsFilePatchSchema[] = [];

    for (const file of mappedFiles) {
      if ("id" in file && isString(file.id)) {
        updatedFiles.push(file as UploadsFilePatchSchema);
      } else {
        newFiles.push(file as UploadsFilePostSchema);
      }
    }

    const newFilesResult = newFiles.length
      ? await this.post(newFiles, false)
      : [];
    const updatedFilesResult = updatedFiles.length
      ? await this.patch(updatedFiles, false)
      : [];

    this.updateState();

    return {
      error: [newFilesResult, updatedFilesResult].find(isString),
      newFiles: newFilesResult,
      updatedFiles: updatedFilesResult,
      files: this.getFiles(),
    };
  }
}
