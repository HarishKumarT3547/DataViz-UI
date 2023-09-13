import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  // Calling a local server for uploading the file
  // Need to change the URL with firebase url
  // private baseApiUrl = 'http://localhost:8080';
  // constructor(private http: HttpClient) {}
  constructor(public storage: Storage) {}

  // Uploads file using firebase storage components
  upload(file: File) {
    const storageRef = ref(this.storage, `some_folder/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log('Upload is ' + progress + '% done.');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at: ' + downloadURL);
        });
      }
    );
  }

  // TODO: potentially remove this block once we fully transition to the firebase way of uploading data
  // upload(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   // Request for uploading the file
  //   const req = new HttpRequest('POST', `${this.baseApiUrl}/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   });

  //   return this.http.request(req);
  // }

  // // Getting back the information of the uploaded files
  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.baseApiUrl}/files`);
  // }
}
