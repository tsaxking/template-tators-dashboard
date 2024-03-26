// this is really just used to test some queries and see the results

// import { DB } from '../server/utilities/databases';
import { DB } from '../server/utilities/databases';
import { readFile } from '../server/utilities/files';
import { fromCamelCase, toSnakeCase } from '../shared/text';

// const tables = await DB.getTables();
// if (tables.isErr()) throw tables.error;

// console.log(tables.value);

// if (!tables.value.includes(process.argv[0].toLowerCase())) {
//     throw new Error('Table not found. Please check the name and try again.');
// }

// const res = await DB.unsafe.all(`
//     SELECT * FROM ${process.argv[0]}
// `);

// if (res.isOk()) console.log(res.value);
// else throw new Error(res.error.message);
(async () => {
    // const deCamelCase = (str: string) => {
    //     // return str;
    //     return str.replace(
    //         /[A-Z]*[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/g,
    //         word => {
    //             // console.log(toSnakeCase(fromCamelCase(word)));
    //             let w = toSnakeCase(fromCamelCase(word));
    //             if (w.startsWith('_')) {
    //                 w = w.slice(1);
    //                 // capitalize first letter
    //                 // w = w.charAt(0).toUpperCase() + w.slice(1);
    //             }
    //             return w;
    //         }
    //     );
    // };

    // const initSql = await readFile('storage/db/queries/db/init.sql');

    // if (initSql.isOk()) {
    //     const data = ` SELECT column_name
    //     FROM information_schema.columns
    //     WHERE table_name = :table
    //     ORDER BY column_name;`;
    //     // deCamelCase(data);
    //     console.log(deCamelCase(data));
    // } else {
    //     throw initSql.error;
    // }

    const str = `2012new
 2008or
 2009sac
 2017iri
 2012ut
 2010gal
 2007or
 2022utwv
 2010sac
 2023azva
 2015iri
 2023cabl
 2017utwv
 2008new
 2018abca
 2010ut
 2020abca
 2012was
 2023utwv
 2018cabl
 2013wach
 2019hop
 2016azfl
 2011new
 2019cmptx
 2021cabl
 2017idbo
 2017carv
 2019bcvi
 2020idbo
 2021irhce
 2016idbo
 2011wa2
 2016cars
 2024cmptx
 2016cacc
 2021gamn
 2014utwv
 2014gal
 2022cabl
 2022idbo
 2016cmp
 2017cmptx
 2019idbo
 2009or
 2022new
 2011ut
 2023brd
 202121reg
 2014nvlv
 2019abca
 2014cacc
 2021irhcr
 2017abca
 2018azfl
 2017cacc
 2015azpx
 2008sac`;

    const events = str.split('\n').map(e => e.trim());

    await Promise.all(
        events.map(async e => {
            DB.unsafe.run('DELETE FROM events WHERE eventKey = :eventKey', {
                eventKey: e
            });
        })
    );

    process.exit(0);
})();
