import React, { useState } from 'react';
import { Folder, File, MoreVertical, Download, Trash, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import './App.css';

const FileRepository = () => {
  const [files] = useState([
    { id: 1, name: 'Project Documentation', type: 'folder', items: 5 },
    { id: 2, name: 'budget_2024.xlsx', type: 'file', size: '2.3 MB', modified: '2024-01-12' },
    { id: 3, name: 'presentation.pdf', type: 'file', size: '5.1 MB', modified: '2024-01-10' },
    { id: 4, name: 'Assets', type: 'folder', items: 12 },
    { id: 5, name: 'report.docx', type: 'file', size: '1.8 MB', modified: '2024-01-13' },
  ]);

  const FileIcon = ({ type }) => {
    return type === 'folder' ? 
      <Folder className="folder-icon" /> : 
      <File className="file-icon" />;
  };

  return (
    <Card className="file-repository">
      <CardHeader className="repository-header">
        <CardTitle>File Repository</CardTitle>
        <button className="upload-button">
          <Upload className="upload-icon" />
          Upload
        </button>
      </CardHeader>
      <CardContent>
        <div className="repository-content">
          <div className="grid-header">
            <div className="col-name">Name</div>
            <div className="col-size">Size</div>
            <div className="col-modified">Modified</div>
            <div className="col-actions"></div>
          </div>
          
          {files.map((file) => (
            <div key={file.id} className="grid-row">
              <div className="file-name">
                <FileIcon type={file.type} />
                <span className="name-text">{file.name}</span>
              </div>
              <div className="file-size">
                {file.type === 'folder' ? `${file.items} items` : file.size}
              </div>
              <div className="file-modified">
                {file.type === 'folder' ? '--' : file.modified}
              </div>
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
          ))}
        </div>
      </CardContent>
      <iframe width="350" height="430" allow="microphone;" src="https://console.dialogflow.com/api-client/demo/embedded/f834a131-53b4-4ae3-8bd2-ac26a1f1193e"></iframe>
    </Card>
  );
};

export default FileRepository;