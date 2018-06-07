import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';
import { FilesService } from './../files.service';

import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DbxAuth } from '../configs';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  @Input() path: string;
  storageSpace;
  usedSpace;
  imgUrl;
  private dbxAuth: DbxAuth;
  private subscription: Subscription;
  private compEntries: Array<any> = [];
  private imgEntries: Array<any> = [];

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private filesService: FilesService) {}

ngOnInit() {

    this.activatedRoute.url.subscribe(() => {
    const paths = this.filesService.getFiles(this.router.url);
   });


   this.filesService.stream.subscribe((entries) => {
      this.compEntries = entries;
   });

    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));


      const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
      const localPath = this.path ? '/' + this.path : '';
     /*  const entries = {entries: [{ path: '/appar/', format: 'jpeg', size: 'w64h64' }]}; */
      dbx.usersGetSpaceUsage(null)
        .then(spaceInfo => {
          console.log(spaceInfo);
          this.storageSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
        })
        .catch((error) => {
          console.log(error);
        });


      /* dbx.filesListFolder(this.router.url)
        .then(response => {
          console.log(response);
          this.getEntries(response.entries); */


         /*  for (const entry of response.entries) {
            if (this.isImage(entry.path_lower)) {
              dbx.filesGetThumbnail({ path: entry.path_lower })
                .then((result) => {
                  const fileUrl = URL.createObjectURL((<any> result).fileBlob);
                  document.getElementById(entry.path_lower).setAttribute('src', fileUrl);
                })
                .catch(error => {
                  console.error(error);
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });  //add to service ***** + remove this block*/

  }


  previewFile(event) {
    console.log(event.target.innerText);
  }

  downloadFile(filepath, filename, event) {
    event.preventDefault();
    const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
    dbx.filesDownload({ path: filepath})
      .then((data) => {
        console.log(data);
        const fileurl = URL.createObjectURL((<any>data).fileBlob);
        const a = document.createElement('a');
        if (this.isImage(data.path_lower)) {
          console.log('is image');
        }
        a.setAttribute('href', fileurl);
        a.setAttribute('download', filename);
        a.click();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getEntries(inEntries: Array<any>) {
    this.compEntries = inEntries;
    console.log('storageComp-get entries outside', this.compEntries);
  }

  isImage(fileName: string) {
    const supportedImages = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'gif', 'bmp'];
    const fileEnding = fileName.split('.').pop();
    if (supportedImages.some(imgType => imgType === fileEnding)) {
      return true;
    }
  }

  getFileType(fileName: string) {
    const fileEnding = fileName.split('.').pop();
    let fileType;
    switch (fileEnding) {
      case 'pdf':
        fileType = 'fas fa-file-pdf fa-2x';
        break;
      case ('docx' || 'docx'):
        fileType = 'fas fa-file-word fa-2x';
        break;
      case 'pptx':
        fileType = 'fas fa-file-powerpoint fa-2x';
        break;
      case 'xlsx':
        fileType = 'fas fa-file-excel fa-2x';
        break;
      case ('html' || 'js'):
        fileType = 'fas fa-file-code fa-2x';
        break;
      default:
        fileType = 'fa fa-file fa-2x';
    }
    return fileType;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
