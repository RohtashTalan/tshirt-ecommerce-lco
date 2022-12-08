



class WhereClause{
     constructor(base, bigQ){
        this.base = base;
        this.bigQ = bigQ;
     }

     search(){
        const searchWord = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        }:{}

        this.base = this.base.find({...searchWord})
        return this;
     }


     pager(resultperPage){
        let currentPage = 1;
         if(this.bigQ.page){
            currentPage = this.bigQ.page
         }
         const skipVal = resultperPage *(currentPage-1);

       this.base = this.base.limit(resultperPage).skip(skipVal)

       return this;
     }

     
}