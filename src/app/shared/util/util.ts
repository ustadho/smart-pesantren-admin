import { FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

export default class Utils {

  constructor(private toastr: ToastrService) {

  }

  static calculateSubTotalItem = (qty: number, length: number, width: number, price: number, discPc): number => {

    let tmpAmount = qty*price
    if(length > 0 && width > 0) {
      tmpAmount*=length*width
    }
    if (discPc === null || discPc === '') {
      return tmpAmount;
    }
    let subT = tmpAmount;
    console.log('discPc', discPc)
    if(discPc == null || discPc == undefined) {
      return subT
    }
    const disc = discPc.split('+');
    disc.forEach((d) => {
      if (d !== '') {
        subT *= 1 - parseFloat(d) / 100;
      }
    });

    return subT;
  };

  static calculateDiscAmount = (subtotal, discPc): number => {
    if (discPc === '') {
      return 0;
    }
    const disc = discPc.split('+');
    let ret = subtotal;
    disc.forEach((d) => {
      if (d !== '') {
        ret *= parseFloat(d) / 100;
      }
    });

    return ret;
  };

  static roundUp = (price, num): number => {
    if (isNaN(price)) {
      return price;
    }
    return Math.ceil(price / num) * num;
  }

  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    for (let el in formGroup.controls) {
      if (
        formGroup.controls[el].errors ||
        formGroup.controls[el].status === 'INVALID'
      ) {
        console.log(el);
      }
    }
  }
}
