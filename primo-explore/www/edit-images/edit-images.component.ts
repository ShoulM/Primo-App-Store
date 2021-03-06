import { Component, } from '@angular/core';
import {FileUploaderService} from "../utils/file-uploader.service";
import {IframeService} from "../utils/iframe.service";
import {element} from "angular";
import {ConfigurationService} from "../utils/configuration.service";
import {IconsPickerService} from "../icons-picker/icons-picker.service";

@Component({
  selector: 'prm-edit-images',
  templateUrl: './edit-images.component.html',
  styleUrls: ['./edit-images.component.scss']
})
export class EditImagesComponent {
  private images: {[key: string]: string} = {};
  private _logoFileLabel: string;
  private _faviconFileLabel: string;
  private _svgFileLabel: string;
  private _resourceFilesLabel: string;
  private _uploadDisabled: boolean;

  constructor(private fileUploaderService: FileUploaderService,
              private iframeService: IframeService,
              private configurationService: ConfigurationService,
              private iconsPickerService: IconsPickerService){

    this._logoFileLabel = 'Choose logo file';
    this._faviconFileLabel = 'Choose favicon';
    this._svgFileLabel = 'Choose icons svg';
    this._resourceFilesLabel = 'Choose resource type icons';
    this._uploadDisabled = true;
  }

  setImage(name, files){
    this.images[name]= files;
    if (files.length > 1){
      element(document.querySelector('#label-for-' + name + '')).text(files.length + ' files selected').addClass('is-touched')
    }
    else{
      element(document.querySelector('#label-for-' + name + '')).text(files[0].name).addClass('is-touched')
    }
    if(files.length > 0) {
      this._uploadDisabled = false;
    }
  }

  uploadImages(){
    this.fileUploaderService.uploadFiles('/images', this.images).subscribe(()=>{
      console.log('images uploaded successfully');
      this.iframeService.refreshNuiIFrame();
      if (this.images['custom-ui']) {
        this.iconsPickerService.loadIconsFromServer();
      }
    }, (err)=>{
      console.log('failed to upload images: '+ err.stack)
    });
  }

  removeImages() {
    this.fileUploaderService.removeFiles('/images').subscribe(()=>{
      console.log('images removed successfully');
      this.iframeService.refreshNuiIFrame();
    }, (err)=>{
      console.log('failed to remove images: ' + err.toString())
    });
  }

  get logoFileLabel(): string {
    return this._logoFileLabel;
  }

  set logoFileLabel(value: string) {
    this._logoFileLabel = value;
  }

  get faviconFileLabel(): string {
    return this._faviconFileLabel;
  }

  set faviconFileLabel(value: string) {
    this._faviconFileLabel = value;
  }

  get svgFileLabel(): string {
    return this._svgFileLabel;
  }

  set svgFileLabel(value: string) {
    this._svgFileLabel = value;
  }

  get resourceFilesLabel(): string {
    return this._resourceFilesLabel;
  }

  set resourceFilesLabel(value: string) {
    this._resourceFilesLabel = value;
  }


  get uploadDisabled(): boolean {
    return this._uploadDisabled;
  }

  set uploadDisabled(value: boolean) {
    this._uploadDisabled = value;
  }
}
