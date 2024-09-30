import redis, {createClient} from 'redis';

const client =  createClient({
    url: 'redis://localhost:6379'
});

client.on('error',(err)=>{
    console.log('Redis Error: ',err);
})

client.connect();


export async function putUrlInCache(urlcode: string, longUrl:string){
    await client.set(urlcode,longUrl,{
        EX: 86400 //24 hours
    });
}

export async function getFromCache(urlcode:string): Promise<{success: Boolean,longUrl: string}>{
    const longUrl = await client.get(urlcode);

    if(!longUrl){
        return {
            success: false,
            longUrl: ""
        }
    }

    return {
        success: true,
        longUrl
    }
}