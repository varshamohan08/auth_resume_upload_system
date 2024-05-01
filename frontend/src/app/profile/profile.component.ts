import { Component } from '@angular/core';
import { BackendService } from '../backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})


export class ProfileComponent {

  userDict:any;
  relativePath:any;
  uploadedOn:any;
  hostAddress:string = this.backendService.hostAddress

  constructor(
    private backendService: BackendService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,

  ) {}

  ngOnInit() {
    this.userData()
  }
  userData() {
    this.backendService.getData('user/user_api').subscribe((res)=> {
      this.userDict= res['user']
      this.relativePath= res['resume']['doc_name']
      this.uploadedOn= res['resume']['created_date']
      console.log(this.uploadedOn);
      
    }
    ,(error)=> {
      console.error(error);
    }
    )
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          console.log(droppedFile.relativePath, file);

          const formData = new FormData()
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          });
          formData.append('resume', file, droppedFile.relativePath)
          this.http.put('http://localhost:8000/user/docs_api', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            console.log(data);
            
            swal('Resume uploaded successfully', {
              icon: "success",
            });
            this.relativePath = droppedFile.relativePath
            this.uploadedOn = new Date()
            
          })

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event:any){
    console.log(event);
  }

  public fileLeave(event:any){
    console.log(event);
  }


  Logout() {
    this.backendService.getData('user/logout').subscribe((res) => {
      if (res['detail'] != 'Success') {
        // this.error_message = res['detail']
        this.toastr.error(res['detail'])
      }
      else {
        swal('Logged out successfully', {
          icon: "success",
        });
        this.router.navigate(['']);

      }
    })
  }
  removeResume() {
    this.backendService.deleteData('user/docs_api').subscribe((res) => {
      if (res['detail'] != 'Success') {
        this.toastr.error(res['detail'])
      }
      else {
        swal('Removed successfully', {
          icon: "success",
        });
        this.uploadedOn = null
        this.relativePath = null
      }
    })
  }
}
