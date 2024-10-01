// export const catchAsyncErrors=(theFunct)=>{
//     return (req,res,next)=>{
//         Promise.resolve(theFunct(req,res,next)).catch(next);
//     };
// };

export const catchAsyncErrors = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };