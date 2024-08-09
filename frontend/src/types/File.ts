export interface IListFilesResponse {
  folders: string[];
  files: string[];
}

export interface IFile extends IListFilesResponse{
  currentPathFile: string[];
}
