
class RecommenderSystem {
    constructor(matrix,list_userid){
        this.matrix = matrix;
        let num_of_users = matrix.length;
        let num_of_categories = matrix[0].length;
        this.modulSquare = new Array(num_of_categories);

        this.matrixsim = this.simij(this.matrix);
        // console.log("HIHIHEHEHEHEHEHE");
        // console.log(this.matrixsim);
        // console.log("HEHEHEHEHEHHIHIHHIIHI");
        for (let j = 0; j < num_of_categories; j++) {
            let sum = 0;
            for (let i = 0; i < num_of_users; i++) {
                sum += matrix[i][j] * matrix[i][j];
            }
            this.modulSquare[j] = sum;
        }
        this.list_userid = list_userid;
        // console.log("aaaaaaaaaa");
        this.listUser = [];
    }
    createMatrix(column,row){
        let matrixdemo = new Array(num_of_users);
        for(let i=0; i<matrix.length; i++) {
            matrixsim[i] = new Array(10+1).join('0').split('').map(parseFloat);
        }
    }

}
RecommenderSystem.prototype.init =function (num_of_users,number_of_categories) {
    var matrix = new Array(num_of_users);
    for(let i=0; i<matrix.length; i++) {
        matrix[i] = new Array(number_of_categories);
    }
    return matrix
}
RecommenderSystem.prototype.createMatrix =function () {
        var matrix = new Array(listUser.length);
        for(let i=0; i<listUser.length; i++) {
            matrix[i] = listItem[i];
        }
        return matrix
}
RecommenderSystem.prototype.mulcolumnwithcolumn=function (col1,col2) {
    let result =0
    for(let i =0;i<col1.length;i++){
        result =  result + col1[i]*col2[i]
    }
    return result;
}
RecommenderSystem.prototype.modulMatrix = function (col) {
    let sum =0;
    for(let i =0;i<col.length;i++){
        sum =  sum +col[i]*col[i]
    }
    // console.log('sum '+sum)
    return Math.sqrt(sum)
}
RecommenderSystem.prototype.cosij =function (col1,col2) {
    const a =  this.mulcolumnwithcolumn(col1,col2)
    // console.log('a = '+a);
    let c =  this.modulMatrix(col1)
    // console.log("c = " +c);
    let d =  this.modulMatrix(col2)
    // console.log('d ='+ d);
    if(c==0||d==0)return 0;
    return a/(c*d);
}
RecommenderSystem.prototype.simij = function (matrix) {
    let matrixsim = [];
    let array = [];
    for(let j=0;j<matrix[0].length;j++) {
        // console.log('i=' + j);
        for (let i = 0; i < matrix[0].length; i++) {
            // console.log('j va i' + j + i)
            array.push(this.cosij(this.column(matrix, j), this.column(matrix, i)));
        }
        // for(let j=0;j<listItem[0].length;j++) {
        //    for(i=j;i<listItem[0].length;i++){
        //        console.log('j va i' + j + i);
        //        array.push(cosij(column(matrix, j), column(matrix, i)));
        //    }
        matrixsim[j] = array;
        array = [];
    }
    // console.log("day la ma tran tuong quan");
    // console.log(matrixsim);
    // console.log("het")     ;
    // matrixsim[j] = array;
    // array = [];

    return matrixsim
}

RecommenderSystem.prototype.showpredict =function (idUser) {
    this.map(this.list_userid);
    let array= this.prediction(this.checkindex(idUser));
    //console.log(array);
    if(this.prediction((this.checkindex(idUser))) == -1) {
        return -1 ;
    }else {

        // console.log("day la mang    " + array);
        // console.log(Math.max(...array));
        return array.indexOf(Math.max(...array));
    }
}
RecommenderSystem.prototype.row =function () {

}
RecommenderSystem.prototype.column = function (matrix,location) {
    let array = [];
    for(let j=0;j<matrix.length;j++){
        array.push(matrix[j][location])
    }
    // console.log(array);
    return array
}
RecommenderSystem.prototype.prediction =function (idUser) {
    let u = idUser;
    let num_of_items = this.matrix[0].length;
    let is_cold_start = 1;
    for (let j = 0; j < num_of_items; j++){
        if (this.matrix[u][j] !== 0){
            is_cold_start = 0;
        }
    }
    if (is_cold_start === 1){
        return -1;
    }
    P_u = new Array(num_of_items);
    for (let i = 0; i < num_of_items; i++){
        P_u[i] = 0;
    }
    console.log(P_u);
    for(let i=0;i<this.matrixsim[0].length;i++){
        //sum = sum+ cosij(column(matrixsim,item),column(matrixsim,i))* matrix[idUser-1][i]
        u = idUser;
        // console.log("Day la u :");
        // console.log(u);
        // console.log("Ket thuc u");
        P_u[i] = 0;
        // console.log(this.matrixsim);
        // console.log(this.matrix);
        for (let j = 0; j < num_of_items; j++){
            P_u[i] += this.matrixsim[i][j] * this.matrix[u][j];
            /*
            console.log("Day la matrixsim[i][j]");
            console.log(this.matrixsim[i][j]);
            console.log("Ket thuc matrixsim[i][j]");

            console.log("Day la matrix[u][j]");
            console.log(this.matrix[u][j]);
            console.log("Ket thuc matrix[u][j]")
            */
        }
        // console.log("Day la P[u][i]");
        // console.log(P_u[i]);
        // console.log("Ket thuc P[u][i]");
        //  sum1 = sum1+ cosij(column(matrixsim,item),column(matrixsim,i))
        // console.log('sum '+sum);
        // console.log('sum1 '+sum1);
    }
    // array = divMatrixwithArray(matrixsim,matrix[idUser])
    //    return sum/sum1;
    //return sum;

    return P_u;
}

RecommenderSystem.prototype.updateRecommendation = function (userId,categoryId) {
    let m = userId-1;
    let k = categoryId-1;
    this.matrix[m][k]++;
    let temp = this.modulSquare[k]+2*this.matrix[m][k]-1;
    for(let j =0;j<this.modulSquare.length;j++){
        if(j == k)
            continue;
        this.matrixsim[k][j]= this.matrixsim[k][j]*this.modulSquare[k]/temp   +this.matrix[m][j]/(temp*this.modulSquare[j]);
    }
    this.modulSquare[k] = temp;
}
RecommenderSystem.prototype.map =function (list_userid) {
    for(let i=0;i<list_userid.length;i++){
        this.listUser[i] = list_userid[i];
    }
}
RecommenderSystem.prototype.checkindex = function (userid) {

    // console.log("aaa");
    for(let i=0;i<this.list_userid.length;i++){
        // console.log(this.list_userid[i]);

        if(userid == this.list_userid[i]){
            // console.log(i+"aaaaaa") ;
            return i;
        }

    }

}
RecommenderSystem.prototype.demap = function (id) {
    return this.list_userid[id];
}

// function  createMatrix(listUser,listItem) {
//
//     var matrix = new Array(listUser.length);
//     for(let i=0; i<listUser.length; i++) {
//         matrix[i] = listItem[i];
//     }
//    return matrix
// }
// // function divMatrixwithArray(matrix, array) {
// //
// //   let result = []
// //     let resultall  =[];
// //   for(let  j =0;j<listItem.length;j++){
// //       let sum = 0
// //      for(let  i =0;i<array.length;i++){
// //         result[i] = array[i]* matrix[i][j]
// //          console.log(result[i]);
// //          sum = sum + result[i];
// //     }
// //     resultall[j] = sum
// //   }
// //     return resultall;
// // }
// function mulcolumnwithcolumn(col1,col2) {
//      let result =0
//     for(let i =0;i<col1.length;i++){
//         result =  result + col1[i]*col2[i]
//     }
//     return result
//   }
// function modulMatrix(col) {
//      let sum =0;
//      for(let i =0;i<col.length;i++){
//          sum =  sum +col[i]*col[i]
//      }
//      console.log('sum '+sum)
//      return Math.sqrt(sum)
//      }
// function cosij(col1,col2) {
//    const a =  mulcolumnwithcolumn(col1,col2)
//     console.log('a = '+a);
//     let c =  modulMatrix(col1)
//     console.log("c = " +c);
//     let d =  modulMatrix(col2)
//     console.log('d ='+ d);
//    return a/(c*d);
// }
// function simij(matrix) {
//     let matrixsim = [];
//     let array = [];
//         for(let j=0;j<listItem[0].length;j++) {
//             console.log('i=' + j);
//             for (let i = 0; i < matrix[0].length; i++) {
//                 console.log('j va i' + j + i)
//                 array.push(cosij(column(matrix, j), column(matrix, i)));
//             }
//         // for(let j=0;j<listItem[0].length;j++) {
//         //    for(i=j;i<listItem[0].length;i++){
//         //        console.log('j va i' + j + i);
//         //        array.push(cosij(column(matrix, j), column(matrix, i)));
//         //    }
//             matrixsim[j] = array;
//             array = [];
//         }
//         console.log("day la ma tran tuong quan");
//         console.log(matrixsim);
//         console.log("het")     ;
//     // matrixsim[j] = array;
//             // array = [];
//
//     return matrixsim
// }
// function  column(matrix,location) {
//      let array = [];
//     for(let j=0;j<matrix.length;j++){
//         array.push(matrix[j][location])
//     }
//     console.log(array);
//     return array
// }
// function row(matrix,location){
//     let array = [];
//     for(let j=0;j<matrix.length;j++){
//         array.push(matrix[location][j])
//     }
//     return array
// }
// function prediction(matrix,matrixsim,idUser){
//   let num_of_items = matrix[0].length;
//   P_u = new Array(num_of_items);
//   for (let i = 0; i < num_of_items; i++){
//       P_u[i] = 0;
//   }
//   console.log(P_u);
//   for(let i=0;i<matrixsim[0].length;i++){
//       //sum = sum+ cosij(column(matrixsim,item),column(matrixsim,i))* matrix[idUser-1][i]
//       u = idUser - 1;
//       P_u[i] = 0;
//       for (let j = 0; j < num_of_items; j++){
//           P_u[i] += matrixsim[i][j] * matrix[u][j];
//       }
//      //  sum1 = sum1+ cosij(column(matrixsim,item),column(matrixsim,i))
//       // console.log('sum '+sum);
//      // console.log('sum1 '+sum1);
//   }
//  // array = divMatrixwithArray(matrixsim,matrix[idUser])
//  //    return sum/sum1;
//     //return sum;
//
//     return P_u;
// }
// function showprediction(idUser) {
//     let array= prediction(matrix,simij(matrix),idUser);
//
//     console.log("day la mang    " + array);
//     console.log(Math.max(...array));
//         return  array.indexOf(Math.max(...array));
//
//
// }
module.exports = RecommenderSystem;

// let Recommend = new RecommenderSystem(listItem);
// console.log("FDSDSFDSFDFSDFSDFS");
// console.log("FFFFFFFF");
// console.log("");
// console.log(Recommend.showpredict(1));
//console.log(Recommend.updateRecommendation(1,1));