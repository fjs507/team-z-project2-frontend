import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Item } from '../models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  //ROUTING NOTE: This is the managerdashboard



  items = new Array;
  show = false; //for the display div
  itemFindForm: FormGroup;
  itemDeleteForm: FormGroup;
  itemUpdateForm: FormGroup;
  itemCreateForm: FormGroup;
  targetItem = new Item;
  tgtItem = new Array;
  
  constructor(private itemService:ItemService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    
    this.itemFindForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
    this.itemDeleteForm = this.formBuilder.group({
      idDelete: ['', Validators.required]
    });
    this.itemUpdateForm = this.formBuilder.group({
      idUpdate: ['', Validators.required],
      nameUpdate: ['', Validators.required],
      priceUpdate: ['', Validators.required],
      stockUpdate: ['', Validators.required],
      descriptionUpdate: ['', Validators.required],
      urlUpdate: ['', Validators.required],
      genreUpdate: ['', Validators.required]
    });
    this.itemCreateForm = this.formBuilder.group({
      idCreate: ['', Validators.required],
      nameCreate: ['', Validators.required],
      priceCreate: ['', Validators.required],
      stockCreate: ['', Validators.required],
      descriptionCreate: ['', Validators.required],
      urlCreate: ['', Validators.required],
      genreCreate: ['', Validators.required]
    });
  }
  get formFields() { //for find by ID
    return this.itemFindForm.controls;
  }  
  get updateFields() {
    return this.itemUpdateForm.controls;
  }  
  get deleteFields() {
    return this.itemDeleteForm.controls;
  }  
  get createFields() {
    return this.itemCreateForm.controls;
  }  
  updateItem(){
    let updatedItem = new Item;
    updatedItem.$item_id = this.updateFields.idUpdate.value;
    updatedItem.$name = this.updateFields.nameUpdate.value;
    updatedItem.$price = this.updateFields.priceUpdate.value;
    updatedItem.$stock = this.updateFields.stockUpdate.value;
    updatedItem.$description = this.updateFields.descriptionUpdate.value;
    updatedItem.$itemImageUrl = this.updateFields.urlUpdate.value;
    updatedItem.$genre_id = this.updateFields.genreUpdate.value;
    console.log("Updated item: "+ updatedItem);
    this.itemService.updateTargetItem(updatedItem)
    .subscribe(
      () => {
        console.log('Update successful!');
      },
      // if an error occurs, execute the function below
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }
  createItem(){
    let createdItem = new Item;
    createdItem.$name = this.createFields.nameCreate.value;
    createdItem.$price = this.createFields.priceCreate.value;
    createdItem.$stock = this.createFields.stockCreate.value;
    createdItem.$description = this.createFields.descriptionCreate.value;
    createdItem.$itemImageUrl = this.createFields.urlCreate.value;
    createdItem.$genre_id = this.createFields.genreCreate.value;
    console.log("Create item: "+ createdItem);
    this.itemService.createItem(createdItem)
    .subscribe(
      () => {
        console.log('Creation successful!');
      },
      // if an error occurs, execute the function below
      err => {
        console.log(err);
      },
      () => {
      }
    );
  }
  deleteItem(){
    let id = this.deleteFields.idDelete.value;
    this.itemService.deleteTargetItem(id).subscribe(
      resp=>{ 
          console.log('Response: '+resp.status);
      },
      err=>{
          console.log(err.status);
      }
    );
  }

  showAllItems(): void{
    //apparently we don't need to parse it.
      //if we try to parse it (again), we will have committed a cardinal sin
        //my punishment was 3 hours of my life gone forever. 
          //thank you typescript
    

    this.itemService.getAllItems().subscribe( //get the stuff
      resp=>{ //take the response (should be a json)
          console.log("resp.body: "+resp.body);
          // console.log("body length"+resp.body.length);
          // let respJSON = JSON.parse(resp.body);
          let respJSON = resp.body;
          console.log("json: "+respJSON);
          console.log('0.id: '+ respJSON[0].id); //THIS ONE RIGHT HERE. THIS WORKS
          let length = Object.keys(respJSON).length; 
          //this is cute. we can't just use .length in typescript. 
            //that's heresy. of course. why would you want to know the length of a json array? 
              //only heathens want that. you're not a heathen, are you? 
                //of course not. 
          console.log("length: "+ length); //(of course not)
          console.log('Response:'+resp.status);
          if(resp.status == 200){ //FIX THIS depending on returned code

            for( let i = 0; i < length ; i++){
              let newItem = new Item();
              newItem.$item_id = respJSON[i].id; //FIX THIS depending on what backend sends back
              newItem.$name = respJSON[i].name;
              newItem.$price = respJSON[i].price;
              newItem.$stock = respJSON[i].stock;
              newItem.$description = respJSON[i].description;
              newItem.$itemImageUrl = respJSON[i].itemImageUrl;
              newItem.$genre_id = respJSON[i].genre_id;
              this.items.unshift(newItem); //adding item to array
              console.log('Added item with id of: '+ respJSON[i]["id"]);
            }
            console.log("Total items added: "+this.items.length);
          }
          
      },
      err=>{
          console.log(err.status);
      }
  );
    //then show the div
    this.revealItems();
    // return itemArray;
  }

  showItem(){
    let id = this.formFields.id.value;
    this.itemService.getTargetItem(id).subscribe( //get the stuff
      resp=>{ //take the response (should be a json)
          
          this.tgtItem.unshift(resp.body);
          
          console.log('0.id: '+ this.tgtItem[0].id); //man this is so gross
          console.log('Response:'+resp.status);
          if(resp.status == 200){ 
            let targetItem = new Item();
            targetItem.$item_id = this.tgtItem[0].id; //FIX THIS depending on what backend sends back
            targetItem.$name = this.tgtItem[0].firstname;
            targetItem.$price = this.tgtItem[0].lastname;
            targetItem.$stock = this.tgtItem[0].email;
            targetItem.$description = this.tgtItem[0].Itemname;
            targetItem.$itemImageUrl = this.tgtItem[0].password;
            targetItem.$genre_id = this.tgtItem[0].genre_id;
            console.log('Added item with id of: '+ this.tgtItem[0]["id"]);
          }
      },
      err=>{
          console.log(err.status);
      }
  );
    this.revealItems();
  }

  revealItems(){ //show toggler
    if(this.show==false){
      this.show=true;
    } 
  }

}
