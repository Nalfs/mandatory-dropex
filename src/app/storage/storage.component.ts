import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { NotificationService } from '../notification.service'; // -- new import by K
import { AuthService } from '../auth.service';
import { FilesService } from '../files.service';
import { StorageService } from '../storage.service';
import { DbxAuth } from '../configs';

// import { SearchComponent } from '../search/search.component'; Deleted by K

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  /* @Input() path: string;
    @Input() status: string; */ /* Deleted by K */

<<<<<<< HEAD
  storageSpace;
  usedSpace;
  imgUrl;
  isStarred = false;
  starredItems = [];
  inEntries: Array<any> = [];
  private dbxAuth: DbxAuth;
  private dbxAuthSubscription: Subscription;
  private fileStreamSubscription: Subscription;
  private compEntries: Array<any> = [];
  private dbxConnection;

  private showFavorites = false;
  private showFavoritesSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filesService: FilesService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.dbxAuthSubscription = this.authService
      .getAuth()
      .subscribe(auth => (this.dbxAuth = auth));

    this.dbxConnection = new Dropbox({ accessToken: this.dbxAuth.accessToken });

    this.activatedRoute.url.subscribe(() => {
      const urlWithoutParams = decodeURIComponent(this.router.url).split('?')[0];
      const paths = this.filesService.getFiles(urlWithoutParams);
    });

    this.fileStreamSubscription = this.filesService.stream.subscribe(
      entries => {
        this.updateFileStream(entries);
      }
    );

    this.showFavoritesSubscription = this.storageService.showFavorites()
      .subscribe(status => {
        this.showFavorites = status;
        console.log('showFavorites', this.showFavorites);
      });
  }

  updateFileStream(inData: Array<any>) {
    console.log('showFavorites-stream', this.showFavorites);
    this.compEntries = inData;

    if (this.showFavorites) {
      const data = this.getFavorites();
      if (data) {
        this.renderData(data);
      }
      this.storageService.deactivateShowFavorites();
    } else {
      this.getData();
      this.renderData(this.compEntries);
    }
  }

  getData() {
    const localPath = this.path ? '/' + this.path : '';
    const entries = {
      entries: [{ path: '/appar/', format: 'jpeg', size: 'w64h64' }]
    };
    this.dbxConnection.usersGetSpaceUsage(null)
      .then(spaceInfo => {
        console.log(spaceInfo);
        this.storageSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
      })
      .catch(error => {
        console.log(error);
      });

    /*  for (const entry of response.entries) {
=======
    private hasChanged = false; // -- new property by K --
    private currentUrl = ''; // -- new property by K --

    path; // Added by K for cheat :-P
    storageSpace;
    usedSpace;
    imgUrl;
    isStarred = false;
    starredItems = [];
    inEntries: Array<any> = [];
    private dbxAuth: DbxAuth;
    private dbxAuthSubscription: Subscription;
    private fileStreamSubscription: Subscription;
    private compEntries: Array<any> = [];
    private dbxConnection;

    private showFavorites = false;
    private showFavoritesSubscription: Subscription;

    constructor(private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private filesService: FilesService,
        private storageService: StorageService,
        private notificationService: NotificationService) { } // -- new service by K --

    ngOnInit() {
        this.dbxAuthSubscription = this.authService
            .getAuth()
            .subscribe(auth => (this.dbxAuth = auth));

        this.dbxConnection = new Dropbox({ accessToken: this.dbxAuth.accessToken });

        this.activatedRoute.url.subscribe(() => {
            const urlWithoutParams = decodeURIComponent(this.router.url).split('?')[0];
            const paths = this.filesService.getFiles(urlWithoutParams);
            if (this.currentUrl === '/') {
                this.currentUrl = '';
            }
            this.currentUrl = urlWithoutParams;
            console.log('this.currentUrl', this.currentUrl);
        });

        this.fileStreamSubscription = this.filesService.stream.subscribe(
            entries => {
                this.updateFileStream(entries);
            }
        );

        this.showFavoritesSubscription = this.storageService.showFavorites()
            .subscribe((status) => {
                this.showFavorites = status;
                console.log('showFavorites', this.showFavorites);
            });

        // New code to auto rerender this component
        this.notificationService.updateCurrentPath(this.currentUrl);
        this.notificationService.checkHasChange()
            .subscribe(changed => {
                this.hasChanged = changed;
                console.log('this.hasChanged', this.hasChanged);
                this.checkHasChanged();
            });
        // -- End new --
    }

    // New method to auto rerender this component
    checkHasChanged() {
        if (this.hasChanged) {
            console.log('reload now', this.compEntries, this.currentUrl);
            this.filesService.getFiles(this.currentUrl);
            this.notificationService.hasReRendered(); // report to service that this component has rerendered
        } else {
            console.log('nothing now', this.currentUrl);
        }
    }
    // -- End new --

    updateFileStream(inData: Array<any>) {
        console.log('showFavorites-stream', this.showFavorites);
        this.compEntries = inData;

        if (this.showFavorites) {
            const data = this.getFavorites();
            this.renderData(data);
            this.storageService.deactivateShowFavorites();
        } else {
            this.renderData(this.compEntries);
        }
    }

    getData() {
        const localPath = this.path ? '/' + this.path : '';
        const entries = {
            entries: [{ path: '/appar/', format: 'jpeg', size: 'w64h64' }]
        };
        this.dbxConnection
            .usersGetSpaceUsage(null)
            .then(spaceInfo => {
                console.log(spaceInfo);
                this.storageSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
            })
            .catch(error => {
                console.log(error);
            });

        /*  for (const entry of response.entries) {
>>>>>>> 3f07eb46b2f05ed245b943f7a7ebfbbda4a3cbd2
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
             } */

    // add to service ***** + remove this block*/
  }

  previewFile(event) {
    console.log(event.target.innerText);
  }

  downloadFile(filepath, filename, event) {
    event.preventDefault();
    this.dbxConnection
      .filesDownload({ path: filepath })
      .then(data => {
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
      .catch(error => {
        console.error(error);
      });
  }

  renderData(inEntries: Array<any>) {
    // this.compEntries = inEntries;
    this.inEntries = inEntries;
    if (localStorage.getItem('entries') !== null) {
      // this.starredItems = JSON.parse(localStorage.getItem('entries')) || [];
      for (let i = 0; i < this.inEntries.length; i++) {
        this.inEntries[i].starred = checkStars(this.inEntries[i]);
        /* for (let n = 0; n < this.starredItems.length; n++) {
                          if (this.compEntries[i].id === this.starredItems[n].id) {
                            this.compEntries[i].starred = true;
                          }
                        } */
      }
    } else {
      for (const entry of this.inEntries) {
        entry.starred = false;
      }
    }
    for (const entry of this.inEntries) {
      if (this.isImage(entry.path_lower)) {
        this.dbxConnection
          .filesGetThumbnail({ path: entry.path_lower })
          .then(result => {
            const fileUrl = URL.createObjectURL((<any>result).fileBlob);
            document
              .getElementById(entry.path_lower)
              .setAttribute('src', fileUrl);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
    console.log('storageComp-get entries outside', inEntries);
  }

  getFavorites() {
    console.log('ok fav');
    const data = JSON.parse(localStorage.getItem('entries'));
    return data;
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
      case 'docx' || 'docx':
        fileType = 'fas fa-file-word fa-2x';
        break;
      case 'pptx':
        fileType = 'fas fa-file-powerpoint fa-2x';
        break;
      case 'xlsx':
        fileType = 'fas fa-file-excel fa-2x';
        break;
      case 'html' || 'js':
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
    const foundItem = this.compEntries.find(item => item.id === id) || {};
    if (foundItem) {
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
    localStorage.setItem('entries', JSON.stringify(this.starredItems));
  }
  ngOnDestroy() {
    this.dbxAuthSubscription.unsubscribe();
    this.fileStreamSubscription.unsubscribe();
  }
}

function checkStars(inItem: any) {
  const currentStartItems = JSON.parse(localStorage.getItem('entries'));
  const results = currentStartItems.filter(item => item.id === inItem.id) || [];

  return results.length > 0 ? true : false;
}
