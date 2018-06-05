import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

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
  isStarred = false;
  starredItems = [];
  private dbxAuth: DbxAuth;
  private subscription: Subscription;
  private compEntries: Array<any> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    if (this.dbxAuth.isAuth) {
      // ------ Beginning your code ------
      const dbx = new Dropbox({ accessToken: this.dbxAuth.accessToken });
      const localPath = this.path ? '/' + this.path : '';
      const entries = {entries: [{ path: '/appar/', format: 'jpeg', size: 'w64h64' }]};
      dbx.usersGetSpaceUsage(null)
        .then(spaceInfo => {
          console.log(spaceInfo);
          this.storageSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
        })
        .catch((error) => {
          console.log(error);
        });
      dbx.filesListFolder({ path: localPath })
        .then(response => {
          console.log(response);
          this.getEntries(response.entries);
          for (const entry of response.entries) {
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
        });
      // ------ End of your code ------
    }
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
        console.error(error);
      });
  }

  getEntries(inEntries: Array<any>) {
    this.compEntries = inEntries;
    if (localStorage.getItem('entries') !== null) {
      // this.starredItems = JSON.parse(localStorage.getItem('entries')) || [];
      for (let i = 0; i < this.compEntries.length; i++) {
        this.compEntries[i].starred = checkStart(this.compEntries[i]);
        console.log(checkStart(this.compEntries[i]));
        /* for (let n = 0; n < this.starredItems.length; n++) {
          if (this.compEntries[i].id === this.starredItems[n].id) {
            this.compEntries[i].starred = true;
          }
        } */


      }
    } else {
      for (const entry of this.compEntries) {
        entry.starred = false;
      }
    }
   // localStorage.setItem('entries', JSON.stringify(this.compEntries));
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

  addStar(id, event) {
    event.preventDefault();
    this.starredItems = JSON.parse(localStorage.getItem('entries')) || [];
    /* this.compEntries.find(item => item.id === id).starred = true;
    console.log(this.compEntries);
    this.starredItems.push({id: id, starred: true}); */
    const foundItem = this.compEntries.find(item => item.id === id) || {} ;
    if (foundItem) {
      console.log(foundItem);
      foundItem.starred = true;
      this.starredItems.push(foundItem);

      localStorage.setItem('entries', JSON.stringify(this.starredItems));
    }
  }
  delStar(id, event) {
    event.preventDefault();
   // this.compEntries = JSON.parse(localStorage.getItem('entries'));
    this.starredItems = JSON.parse(localStorage.getItem('entries')) || [];
    this.compEntries.find(item => item.id === id).starred = false;
    this.starredItems = this.starredItems.filter(el => el.id !== id);
    console.log(this.starredItems);
    localStorage.setItem('entries', JSON.stringify(this.starredItems));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

function checkStart(inItem: any) {
  const currentStartItems = JSON.parse(localStorage.getItem('entries'));
  const results = currentStartItems.filter((item) => item.id === inItem.id)  || [];

  return results.length > 0 ? true : false;
}
