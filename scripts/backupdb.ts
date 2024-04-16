import env from "../server/utilities/env";
import { execute } from '@getvim/execute';
                                                                                                                                                                                                                          
// getting db connection parameters from environment file
const {
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    DATABASE_HOST,
    DATABASE_PORT
} = env;

// defining backup file name
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const backupFile= `pg-backup-${today}.sql`;

// writing postgresql backup function
const takePGBackup = () => {
    execute(`pg_dump -U ${DATABASE_USER}} -h ${DATABASE_HOST} -p ${DATABASE_PORT} -F t -d ${DATABASE_NAME} > ${backupFile}`)
    .then( async () => {
		console.log(`Backup created successfully`);
    })
    .catch( (err: any) => {
		console.log(err);
    });
}

// calling postgresql backup function
takePGBackup();