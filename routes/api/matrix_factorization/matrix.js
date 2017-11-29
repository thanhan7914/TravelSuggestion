let initialize = function(m, n)
{
    let c_matrix = Array(m);
    for(let i = 0; i < m; i++)
        c_matrix[i] = Array(n);
    
    return c_matrix;
};

let size = function(mtx)
{
    let m = mtx.length;
    let n = mtx[0].length;

    return {m, n};
};

let rand_value = function(mtx)
{
    let {m, n} = size(mtx);
    for(let i = 0; i < m; i++)
        for(let j = 0; j < n; j++)
            mtx[i][j] = Math.random();
};

let multi = function(a_matrix, b_matrix)
{
    let m = a_matrix.length;
    let n = a_matrix[0].length;
    let p = b_matrix[0].length;

    let c_matrix = initialize(m, p);

    for(let i = 0; i < m; i++)
        for(let j = 0; j < p; j++)
        {
            let sum = 0;

            for(let r = 0; r < n; r++)
                sum += a_matrix[i][r] * b_matrix[r][j];
            
            c_matrix[i][j] = sum;
        }
    
    return c_matrix;
};

let T = function(mtx)
{
    let {m, n} = size(mtx);
    let c_matrix = initialize(n, m);

    for(let i = 0; i < m; i++)
        for(let j = 0; j < n; j++)
            c_matrix[j][i] = mtx[i][j];

    return c_matrix;
};

let clone = function(mtx)
{
    let {m, n} = size(mtx);
    let c_matrix = initialize(m, n);
    
    for(let i = 0; i < m; i++)
    for(let j = 0; j < n; j++)
        c_matrix[i][j] = mtx[i][j];

    return c_matrix;
};

let sum_collumn = function(mtx, col)
{
    let m = mtx.length;
    let sum = 0;
    for(let i = 0; i < m; i++)
       sum += mtx[i][col];

    return sum;
};

let sum_row = function(mtx, row)
{
    let n = mtx[0].length;
    let sum = 0;
    for(let i = 0; i < n; i++)
       sum += mtx[row][i];

    return sum;
};

let sum_collumns = function(mtx)
{
    let n = mtx[0].length;
    let sum = Array(n);
    for(let i = 0; i < n; i++)
        sum[i] = sum_collumn(mtx, i);

    return sum;
};

module.exports = {initialize, size, rand_value, multi, T, clone, sum_collumn, sum_row, sum_collumns};
