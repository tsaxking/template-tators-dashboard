import { Point2D } from '../calculations/src/linear-algebra/point';

type AreaMap = {
    red: Point2D[];
    blue: Point2D[];
};

export const stages: AreaMap = {
    blue: [
        // [0.27475516866158867, 0.4961915125136017],
        // [0.3781284004352557, 0.36670293797606096],
        // [0.3895538628944505, 0.383025027203482],
        // [0.39227421109902066, 0.6441784548422198],
        // [0.3781284004352557, 0.6626768226332971],
        // [0.27529923830250275, 0.5321001088139282]
        [0.362570735650768, 0.33063864187550523],
        [0.3755052546483428, 0.34761519805982216],
        [0.37752627324171384, 0.6483427647534358],
        [0.36135812449474536, 0.6653193209377526],
        [0.24171382376717865, 0.5181891673403395],
        [0.2437348423605497, 0.47696038803556995]
    ],
    red: [
        [0.6248989490703315, 0.3468067906224737],
        [0.6390460792239289, 0.3314470493128537],
        [0.7582861762328214, 0.4793856103476152],
        [0.7590945836701698, 0.5198059822150364],
        [0.6394502829426031, 0.6709781729991916],
        [0.6232821341956346, 0.6515763945028294]
        // [0.6066376496191512, 0.3808487486398259],
        // [0.6180631120783461, 0.367791077257889],
        // [0.720348204570185, 0.49836779107725787],
        // [0.7219804134929271, 0.528835690968444],
        // [0.6202393906420022, 0.6583242655059848],
        // [0.6066376496191512, 0.6420021762785637]
    ]
};

export const amps: AreaMap = {
    blue: [
        // [0.13547334058759522, 0.15451577801958652],
        // [0.27747551686615884, 0.15451577801958652],
        // [0.27747551686615884, 0.11099020674646355],
        // [0.13438520130576714, 0.11099020674646355]
        [0.246160064672595, 0.0444624090541633],
        [0.24575586095392077, 0.09539207760711399],
        [0.08164915117219078, 0.09296685529506872],
        [0.08245755860953921, 0.046079223928860144]
    ],
    red: [
        // [0.7176278563656148, 0.11425462459194777],
        // [0.719260065288357, 0.15560391730141457],
        // [0.8618063112078346, 0.15669205658324264],
        // [0.8618063112078346, 0.10772578890097932],
        [0.7550525464834277, 0.0444624090541633],
        [0.7546483427647535, 0.09215844785772029],
        [0.919967663702506, 0.09539207760711399],
        [0.919967663702506, 0.0444624090541633]
    ]
};

// export const srcs: AreaMap = {
//     blue: [
//         [0.780739934711643, 0.9140369967355821],
//         [0.780739934711643, 0.8618063112078346],
//         [0.8601741022850925, 0.7606093579978237],
//         [0.8612622415669206, 0.808487486398259]
//     ],
//     red: [
//         [0.13492927094668117, 0.7595212187159956],
//         [0.21545157780195864, 0.8628944504896626],
//         [0.21436343852013057, 0.911860718171926],
//         [0.13329706202393907, 0.8073993471164309],
//     ],
// };

export const zones: AreaMap = {
    blue: [
        [0.37752627324171384, 0.04688763136620857],
        [0.07760711398544867, 0.038803556992724336],
        [0.07962813257881972, 0.22635408245755861],
        [0.12409054163298303, 0.28213419563459985],
        [0.12489894907033144, 0.39854486661277283],
        [0.0788197251414713, 0.4518997574777688],
        [0.08003233629749394, 0.7728375101050929],
        [0.17582861762328214, 0.8924818108326596],
        [0.17380759902991108, 0.9531123686337915],
        // [0.3730800323362975, 0.9514955537590946],
        [0.37631366208569117, 0.9498787388843978]

        // [0.780739934711643, 0.9140369967355821],
        // [0.780739934711643, 0.8618063112078346],
        // [0.8601741022850925, 0.7606093579978237],
        // [0.8612622415669206, 0.808487486398259]
    ],
    red: [
        [0.624090541632983, 0.043654001616814875],
        [0.9207760711398545, 0.043654001616814875],
        [0.9207760711398545, 0.2255456750202102],
        [0.8746968472109944, 0.2837510105092967],
        [0.8755052546483427, 0.396928051738076],
        [0.9207760711398545, 0.45432497978981407],
        [0.9203718674211803, 0.7712206952303962],
        [0.8274050121261115, 0.8868229587712207],
        [0.8265966046887632, 0.952303961196443],
        [0.6248989490703315, 0.952303961196443]
        // [0.13492927094668117, 0.7595212187159956],
        // [0.21545157780195864, 0.8628944504896626],
        // [0.21436343852013057, 0.911860718171926],
        // [0.13329706202393907, 0.8073993471164309]
    ]
};

export const srcs: AreaMap = {
    blue: [
        [0.8278092158447857, 0.9490703314470493],
        [0.9211802748585287, 0.8326596604688763],
        [0.9195634599838318, 0.7736459175424414],
        [0.8286176232821342, 0.889248181083266]
        // [0.3911860718171926, 0.11207834602829161],
        // [0.13547334058759522, 0.11534276387377584],
        // [0.13492927094668117, 0.808487486398259],
        // [0.21490750816104462, 0.9162132752992383],
        // [0.3895538628944505, 0.9096844396082698]
    ],
    red: [
        [0.08043654001616815, 0.7768795472918351],
        [0.07962813257881972, 0.8302344381568311],
        [0.17380759902991108, 0.9506871463217461],
        [0.1746160064672595, 0.8916734033953112]
        // [0.6055495103373232, 0.10990206746463548],
        // [0.8607181719260065, 0.10663764961915125],
        // [0.8623503808487486, 0.8073993471164309],
        // [0.779651795429815, 0.911860718171926],
        // [0.6066376496191512, 0.9064200217627857]
    ]
};

export const autoZone: AreaMap = {
    blue: [
        [0.07962813257881972, 0.09458367016976556],
        [0.17542441390460792, 0.09215844785772029],
        [0.17623282134195634, 0.9506871463217461],
        [0.08003233629749394, 0.8334680679062247],
        [0.08043654001616815, 0.4559417946645109],
        [0.12409054163298303, 0.4009700889248181],
        [0.12449474535165723, 0.28213419563459985],
        [0.08003233629749394, 0.2255456750202102]
        // [0.13492927094668117, 0.15451577801958652],
        // [0.21708378672470077, 0.15560391730141457],
        // [0.21817192600652885, 0.8650707290533188],
        // [0.13547334058759522, 0.7573449401523396]
    ],
    red: [
        [0.8237671786580436, 0.09539207760711399],
        [0.919967663702506, 0.09700889248181083],
        [0.9207760711398545, 0.22473726758286175],
        [0.875909458367017, 0.2853678253839935],
        [0.8755052546483427, 0.39611964430072755],
        [0.9211802748585287, 0.4494745351657235],
        [0.9211802748585287, 0.8326596604688763],
        [0.8274050121261115, 0.9498787388843978]

        // [0.779107725788901, 0.15669205658324264],
        // [0.8623503808487486, 0.15669205658324264],
        // [0.8618063112078346, 0.7606093579978237],
        // [0.780195865070729, 0.8585418933623504]
    ]
};

export const border = [
    [0.9207760711398545, 0.04203718674211803],
    [0.9203718674211803, 0.22797089733225545],
    [0.875909458367017, 0.28294260307194824],
    [0.8755052546483427, 0.39531123686337916],
    [0.9211802748585287, 0.45675020210185935],
    [0.9211802748585287, 0.8334680679062247],
    [0.8249797898140663, 0.9555375909458367],
    [0.1746160064672595, 0.9555375909458367],
    [0.07962813257881972, 0.8326596604688763],
    [0.07962813257881972, 0.4494745351657235],
    [0.12611156022635409, 0.3993532740501213],
    [0.12449474535165723, 0.2837510105092967],
    [0.08003233629749394, 0.22473726758286175],
    [0.08043654001616815, 0.04284559417946645]
    // [0.13438520130576714, 0.11316648531011969],
    // [0.8628944504896626, 0.10772578890097932],
    // [0.8634385201305768, 0.8106637649619152],
    // [0.780739934711643, 0.9162132752992383],
    // [0.21545157780195864, 0.9162132752992383],
    // [0.13329706202393907, 0.808487486398259]
];

export const notePositions: Point2D[] = [
    [0.5, 0.12884834663625996],
    [0.5, 0.31584948688711517],
    [0.5, 0.5],
    [0.5, 0.685290763968073],
    [0.5, 0.8700114025085519],
    [0.7736602052451539, 0.18129988597491448], // red
    [0.7736602052451539, 0.34207525655644244], // red
    [0.7736602052451539, 0.5], // red
    [0.22690992018244013, 0.18129988597491448], // blue
    [0.22690992018244013, 0.33979475484606614], // blue
    [0.22690992018244013, 0.5] // blue
];

export const all = {
    stages,
    amps,
    zones,
    srcs,
    autoZone,
    border
};
