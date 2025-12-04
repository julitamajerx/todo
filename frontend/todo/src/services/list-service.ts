import { Injectable } from '@angular/core';
import { sample_lists } from '../data';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  getAllLists() {
    return sample_lists;
  }
}
