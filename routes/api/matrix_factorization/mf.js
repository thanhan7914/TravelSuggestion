let matrix = require('./matrix');

let mf_prediction = function(W, K, i, j)
{
    let X = matrix.multi(W, matrix.T(H));

    return X[i][j];
};

let mf_train = function(Xboard, loop, K, beta, lambda)
{
    let {m, n} = matrix.size(Xboard);
    let W = matrix.initialize(m, K);
    let H = matrix.initialize(n, K);

    matrix.rand_value(W);
    matrix.rand_value(H);

    return mf_retrain(Xboard, loop, W, H, K, beta, lambda);
};

let mf_retrain = function(Xboard, loop, W, H, K, beta, lambda)
{
    let {m, n} = matrix.size(Xboard);

    for(let i = 0; i < loop; i++)
    {
        for(let i = 0; i < m; i++)
        for(let j = 0; j < n; j++)
        {
            if(Xboard[i][j] === undefined) continue;
            if(Xboard[i][j] === -1) continue;

            let Rui = 0;
            for(let k = 0; k < K; k++)
                Rui += W[i][k] * H[j][k];
            
            let Eui = Xboard[i][j] - Rui;
            for(let k = 0; k < K; k++)
            {
                W[i][k] = W[i][k] + beta * (Eui * H[j][k] - lambda * W[i][k] );
                H[j][k] = H[j][k] + beta * (Eui * W[i][k] - lambda * H[j][k] );
            }
        }
    }
    

    return {W, H};
};

let mf_rebuild = function(Xboard, W, H)
{
    let {m, n} = matrix.size(Xboard);
    let Xui = matrix.multi(W, matrix.T(H));
    let X = matrix.clone(Xboard);

    for(let i = 0; i < m; i++)
    for(let j = 0; j < n; j++)
    {
        if(X[i][j] !== -1) continue;

        X[i][j] = Xui[i][j];
    }

    return X;
};

module.exports = {mf_train, mf_prediction, mf_retrain, mf_rebuild};
