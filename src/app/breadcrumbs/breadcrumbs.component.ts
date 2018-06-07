import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilesService } from './../files.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
    pathArray;
    goBack;
    parentFolder;
    currentPath;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private filesService: FilesService) {
  }

  ngOnInit() {
      this.subscription = this.activatedRoute.url.subscribe(() => {
        this.pathArray = this.getPathsToRenderFromUrl(this.router.url);
        this.goBack = this.goBackFn(this.currentPath);
      });
  }

  getPathsToRenderFromUrl(currentPath) {
    let paths = currentPath.split('/');
    if (currentPath === '' || currentPath === '/' ) {
    paths = [''];
  }
    let fullpath = '';
    const pathsToRender = [];
    for (let i = 0; i < paths.length; i++) {
        const path = decodeURI(paths[i]);
        fullpath += `/${path}`;
        pathsToRender.push({
          path,
          fullpath,
        });
      }
    return pathsToRender;
  }

  goBackFn(currentPath) {
    return this.parentFolder = this.pathArray.slice(0, -1);
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
}

}
