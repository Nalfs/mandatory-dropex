import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dropbox } from 'dropbox';

import { NotificationService } from '../notification.service'; // -- new import by K
import { AuthService } from '../auth.service';
import { FilesService } from '../files.service';
import { StorageService } from '../storage.service';
import { DbxAuth } from '../configs';
import { LocalStorageMethods } from '../utils';

// import { SearchComponent } from '../search/search.component'; Deleted by K

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit, OnDestroy {
  /* @Input() path: string;
    @Input() status: string; */ /* Deleted by K */

    private hasChanged = false; // -- new property by K --
    private currentUrl = ''; // -- new property by K --

    path; // Added by K for cheat :-P
    storageSpace;
    usedSpace;
    spacePercentage;
    imgUrl;
    isStarred = false;
    starredItems = [];
    inEntries: Array<any> = [];
    showLastSearch = false;
    lastSearch;
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
        if (sessionStorage.getItem('lastSearches') !== null) {
          this.showLastSearch = !this.showLastSearch;
          this.lastSearch = JSON.parse(sessionStorage.getItem('lastSearches'));
          console.log('this is' , this.lastSearch);
          if (this.lastSearch.length > 2) {
            this.lastSearch = this.lastSearch.slice(-3);
          }
        }

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
            const data = LocalStorageMethods.retrieve('entries') || []; // Modified by K
            this.renderData(data);
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
        this.dbxConnection
            .usersGetSpaceUsage(null)
            .then(spaceInfo => {
                console.log(spaceInfo);
                this.storageSpace = (spaceInfo.allocation.allocated / 1024 / 1024 / 1024).toFixed(2);
                this.usedSpace = (spaceInfo.used / 1024 / 1024 / 1024).toFixed(2);
                this.spacePercentage = (this.usedSpace / this.storageSpace) * 100;
                console.log(this.spacePercentage);
            })
            .catch(error => {
                console.log(error);
            });
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
   if (inEntries.length > 0) {
     if (LocalStorageMethods.retrieve('entries') !== null) {
       for (let i = 0; i < inEntries.length; i++) {
         inEntries[i].starred = checkStars(inEntries[i]);
       }
     } else {
       for (const entry of inEntries) {
         entry.starred = false;
       }
     }

     for (const entry of inEntries) {
       if (this.isImage(entry.path_lower)) {
         this.dbxConnection
           .filesGetThumbnail({ path: entry.path_lower })
           .then((result) => {
             const fileUrl = URL.createObjectURL((<any>result).fileBlob);
             document
               .getElementById(entry.path_lower)
               .setAttribute('src', fileUrl);
           })
           .catch((error) => {
             console.error(error);
           });
       }
     }
     console.log(inEntries);
     /* const sortEntries = inEntries.sort((a, b) => {
      return a.size - b.size;
     });
     console.log(sortEntries); */
     this.inEntries = inEntries;
   }
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
    this.starredItems = LocalStorageMethods.retrieve('entries') || [];
    const foundItem = this.compEntries.find(item => item.id === id) || {};
    if (foundItem) {
      foundItem.starred = true;
      this.starredItems.push(foundItem);
      LocalStorageMethods.store('entries', this.starredItems);
    }
  }

  delStar(id, event) {
    event.preventDefault();
    this.starredItems = LocalStorageMethods.retrieve('entries') || [];
    this.inEntries.find(item => item.id === id).starred = false;
    this.starredItems = this.starredItems.filter(el => el.id !== id);
    LocalStorageMethods.store('entries', this.starredItems);
  }

  ngOnDestroy() {
    this.dbxAuthSubscription.unsubscribe();
    this.fileStreamSubscription.unsubscribe();
    this.showFavoritesSubscription.unsubscribe();
  }
}

function checkStars(inItem: any) {
  const currentStartItems = LocalStorageMethods.retrieve('entries') || [];
  const results = currentStartItems.filter(item => item.id === inItem.id) || [];

  return results.length > 0 ? true : false;
}
