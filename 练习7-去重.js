const arr1 = [
    1,2,3,3,4,5,6,6,7,7,
];
const arr2 = [
    {
        id:1,
        value:1
    },
    {
        id:2,
        value:2
    },
    {
        id:2,
        value: 2
    },
    {
        id:3,
        value: 3
    }
]

function unique1() {
    let arr1DeWeight = [];
    for (let i = 0; i < arr1.length; i++) {
        const isPush = arr1DeWeight.includes(arr1[i]);
        if (!isPush){
            arr1DeWeight.push(arr1[i]);
        }
    }
    return arr1DeWeight
}
console.log("arr1DeWeight",unique1())
function unique2() {
    let obj = {};
    return arr2.reduce((arr, next) => {
        let isPush = obj[next['id']] ? false : obj[next['id']] = true;
        if (isPush) {
            arr.push(next)
        }
        return arr;
    }, []);
}
console.log("arr2DeWeight",unique2())