import { Component, OnInit } from '@angular/core';
import { DropexService } from './../dropex.service';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.css']
})
export class PathComponent implements OnInit {

    constructor(private dropexService: DropexService) { }

   ngOnInit() {
    this.dropexService.stream.subscribe((routes) => {
        this.routes = routes;
    });
}

    navigate() {
  }

}
