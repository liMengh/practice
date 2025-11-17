const arr = [
    {
        "checked":"",
        "id":"25",
        "isOpen":false,
        "name":"开发部",
        "open":false,
        "pId":"24"
    },
    {
        "checked":"",
        "id":"26",
        "isOpen":false,
        "name":"运营部",
        "open":false,
        "pId":"24"
    },
    {
        "checked":"",
        "id":"27",
        "isOpen":false,
        "name":"战略部",
        "open":false,
        "pId":"24"
    },
    {
        "checked":"",
        "id":"28",
        "isOpen":false,
        "name":"测试1",
        "open":false,
        "pId":"25"
    },
    {
        "checked":"",
        "id":"29",
        "isOpen":false,
        "name":"测试2",
        "open":false,
        "pId":"25"
    },
    {
        "checked":true,
        "id":"0",
        "isOpen":true,
        "name":"顶级",
        "open":true,
        "pId":"0"
    }
]

const arrayToTree = (items) => {
    const result = [];   // 存放结果集
    const itemMap = {};  //

    // 先转成map存储
    for (const item of items) {
        itemMap[item.id] = {...item, children: []}
    }

    for (const item of items) {
        const id = item.id;
        const pid = item.pId;
        const treeItem = itemMap[id];
        if (pid == 0) {
            result.push(treeItem);
        } else {
            if (!itemMap[pid]) {
                itemMap[pid] = {
                    children: [],
                }
            }
            itemMap[pid].children.push(treeItem)
        }

    }
    return result;
}
// console.log(JSON.stringify(arrayToTree(arr)))


function getCheckedIds(nodes) {
    const result = [];

    function traverse(node) {
        if (!node.children || node.children.length === 0) {
            if (node.checked === true) {
                result.push(node.id);
                return true;
            }
            return false;
        }

        const childCheckResults = node.children.map(traverse);
        const allChildrenChecked = childCheckResults.every(Boolean);

        if (allChildrenChecked) {
            result.push(node.id);
            return true;
        }

        return false;
    }

    nodes.forEach(traverse);
    return result;
}


const tree = [
    {
        checked: false,
        id: "2159",
        isOpen: true,
        name: "测试001",
        open: true,
        pId: 0,
        children: []
    },
    {
        checked: false,
        id: "2160",
        isOpen: false,
        name: "像素代码",
        open: false,
        pId: 2157,
        children: [
            {
                checked: true,
                id: "2166",
                isOpen: false,
                name: "像素代码调试",
                open: false,
                pId: "2160",
                children: []
            },
            {
                checked: true,
                id: "2167",
                isOpen: false,
                name: "像素代码查询token",
                open: false,
                pId: "2160",
                children: []
            }
        ]
    },
    {
        checked: false,
        id: "2168",
        isOpen: false,
        name: "测试落地页",
        open: false,
        pId: 2157,
        children: []
    }
];

const validParentIds = getCheckedIds(tree);
console.log(validParentIds); // 输出符合所有子节点都 checked 的父级 id 列表
