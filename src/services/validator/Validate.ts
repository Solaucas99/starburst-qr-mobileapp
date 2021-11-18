interface ValidationReturn {
  valid: boolean;
  message: string | string[];
  status: 'error' | 'success';
}

interface AmplifySignInAttr {
  username: string;
  password: string;
}

interface AmplifyNewPassAttr {
  password: string;
  name: string;
  nickname: string;
  phone: string;
}

interface VisitorsSignIn {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  isCaptchaChecked: boolean;
}

interface VisitorsUpdate {
  name: string;
  email: string;
  phone: string;
  isCaptchaChecked: boolean;
}

class Validate {
  public static validateCPF(cpf: string): boolean {
    const filterCPF = cpf.replace(/\D+/g, '');

    if (filterCPF.length !== 11) {
      return false;
    }

    if (filterCPF.charAt(0).repeat(11) === filterCPF) {
      return false;
    }

    const cpfProcessado = filterCPF.slice(0, -2);

    const digit1 = Validate.createCPFDigits(cpfProcessado);
    const digit2 = Validate.createCPFDigits(cpfProcessado + digit1);

    const cpfLimpo = cpfProcessado + digit1 + digit2;

    return cpfLimpo === filterCPF;
  }

  public static AmplifySignIn(
    signInAttributes: AmplifySignInAttr,
  ): ValidationReturn {
    const emptyFields = Validate.checkEmptyFields(signInAttributes);
    if (!emptyFields.valid) {
      return emptyFields;
    }

    const passwordTest = Validate.validateAmplifyPassword(
      signInAttributes.password,
    );
    if (!passwordTest.valid) {
      return passwordTest;
    }

    return {
      valid: true,
      message: 'Todos os campos estão válidos.',
      status: 'success',
    };
  }

  // public static AmplifyRequireNewPassword(
  //   reqNewPassAttributes: AmplifyNewPassAttr,
  // ): ValidationReturn {
  //   const emptyFields = Validate.checkEmptyFields(reqNewPassAttributes);
  //   if (!emptyFields.valid) {
  //     return emptyFields;
  //   }

  //   const passwordTest = Validate.validateAmplifyPassword(
  //     reqNewPassAttributes.password,
  //   );
  //   if (!passwordTest.valid) {
  //     return passwordTest;
  //   }

  //   const phoneTest = Validate.validateAmplifyPhoneNumber(
  //     reqNewPassAttributes.phone,
  //   );
  //   if (!phoneTest.valid) {
  //     return phoneTest;
  //   }

  //   return {
  //     valid: true,
  //     message: 'Todos os campos estão válidos.',
  //     status: 'success',
  //   };
  // }

  public static checkEmptyFields(fields: {}): ValidationReturn {
    const obj: string[] = Object.values(fields);

    for (const value in obj) {
      if (obj[value].length === 0) {
        return {
          valid: false,
          message: 'Existem campos vazios no formulário. Preencha novamente.',
          status: 'error',
        };
      }
    }

    return {
      valid: true,
      message: 'Todos os campos estão válidos.',
      status: 'success',
    };
  }

  // public static validateAmplifyPhoneNumber(
  //   phoneNumber: string,
  // ): ValidationReturn {
  //   if (
  //     !validator.isMobilePhone(phoneNumber, 'pt-BR', {
  //       strictMode: true,
  //     })
  //   ) {
  //     return {
  //       valid: false,
  //       message: 'Celular inválido',
  //       status: 'error',
  //     };
  //   }
  //   return {
  //     valid: true,
  //     message: 'Celular válido.',
  //     status: 'success',
  //   };
  // }

  public static validateAmplifyPassword(password: string): ValidationReturn {
    if (password.length < 8) {
      return {
        valid: false,
        message: 'Tamanho de senha inválido.',
        status: 'error',
      };
    }

    return {
      valid: true,
      message: 'Senha válida.',
      status: 'success',
    };
  }

  private static createCPFDigits(cpf: string): string {
    let total = 0;
    let tamanho = cpf.length + 1;

    const cpfArr = cpf.split('');

    cpfArr.forEach(cpfNum => {
      total += Number(cpfNum) * tamanho;
      tamanho -= 1;
    });

    // for (const numero of cpf) {
    //   total += Number(numero) * tamanho;
    //   tamanho -= 1;
    // }

    const digito = 11 - (total % 11);
    return digito <= 9 ? String(digito) : '0';
  }
}

export default Validate;
