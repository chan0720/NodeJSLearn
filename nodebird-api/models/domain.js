module.exports = (sequlize, DataTypes)=>(
    sequelize.define('domain',{
        host: {
            type: DataTypes,STRING(80),
            allowNull: false,
        },
        type : {
            type:DataTypes.STRING(10),
            allowNull: false,
        },
    },{
        validate: {
            unknowType(){
                console.log(this.type, this.type !=='free',this.type !=='premium');
                if (this.type !== 'free'&& this.type !=='premium') {
                    throw new Error('type 컬럼은 free나 premium이어야 합니다.');
                }
            },
        },
            timestamps:true,
            paranoid: true,
    })
);