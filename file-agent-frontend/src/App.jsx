import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Folder, File, MoreVertical, Download, Trash, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import './App.css';
import FileUpload from "./components/ui/FileUpload"

const FileRepository = () => {
  const [files, setFiles] = useState([]);
  const API_URL = "https://flask-backend-635915852841.asia-south2.run.app/files";

  const fetchFiles = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetching files:", data);
      const transformedFiles = data.map(file => ({
        id: file['FileId'],
        name: file['filename'],
        path: file['filepath'],
        size: `${(file['filesize'] / 1024).toFixed(2)} KB`,
        type: file['filetype'],
        modified: new Date(file[5]).toLocaleString(),
        tags: file['tags'],
      }));
      console.log(data);
      setFiles(transformedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUploaded = () => {
    fetchFiles();
  };
  const FileIcon = ({ type }) => {
    return type === 'folder' ?
      <Folder className="folder-icon" /> :
      <File className="file-icon" />;
  };


  return (
    <div className='chatandrepo'>

      <Card className="file-repository">
        <CardHeader className="repository-header">
          <CardTitle>File Repository</CardTitle>
          <FileUpload onUpload={handleFileUploaded} />
        </CardHeader>
        <CardContent>
          <div className="repository-content">
            <div className="grid-header">
              <div className="col-name">Name</div>
              <div className="col-size">Size</div>
              {/* <div className="col-modified">Modified</div> */}
              <div className="col-size">File Url</div>
              <div className="col-size">type</div>
              <div className="col-size">tags</div>
              <div className="col-actions"></div>
            </div>

            {files.map(
              (file) => (
                <div key={file.id} className="grid-row">
                  <div className="file-name">
                    <FileIcon type={file.type} />
                    <span className="name-text">{file.name}</span>
                  </div>
                  <div className="file-size">
                    {file.type === 'folder' ? `${file.items} items` : file.size}
                  </div>
                  {/* <div className="file-modified">
                      {file.type === 'folder' ? '--' : file.modified}
                    </div> */}
                  <div className="file-actions">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="action-trigger">
                        <MoreVertical className="action-icon" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="menu-item">
                          <Download className="menu-icon" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="menu-item delete">
                          <Trash className="menu-icon" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            )
            }
          </div>
        </CardContent>

      </Card>
      <iframe className='chatwin' width="350" height="730" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/f834a131-53b4-4ae3-8bd2-ac26a1f1193e">
      </iframe>
    </div>
  );
};

export default FileRepository;