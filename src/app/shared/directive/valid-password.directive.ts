import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: '[appValidPassword]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidPasswordDirective,
    multi: true
  }]
})
export class ValidPasswordDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const password: string = control.value;
    //console.log('Password:', password);
    const MIN_LEN = 7, MAX_LEN = Number.POSITIVE_INFINITY;
    const hasGoodLength = password?.length > MIN_LEN && password?.length < MAX_LEN;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[ !"#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~]/.test(password);

    if (hasGoodLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecial) {
      return null;
    }
    else {
      return {
        appValidPassword: {
          length: !hasGoodLength,
          lower: !hasLowerCase,
          upper: !hasUpperCase,
          number: !hasNumber,
          special: !hasSpecial
        }
      };
    }
  }
}