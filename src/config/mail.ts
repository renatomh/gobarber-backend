interface IMailConfig {
    // Limitando as opções de driver de e-mail
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string,
            name: string,
        }
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'postmaster.mhsw@mhsw.com.br',
            name: 'Postmaster | MHSW',
        }
    }
} as IMailConfig
