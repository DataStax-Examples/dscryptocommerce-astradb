import { Box, Button, Heading, Img, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { FC, SetStateAction, useEffect, useState } from 'react'
import axios from 'axios'
import { useEthers } from '@usedapp/core'
import { DEPLOYED_ADDRESS } from '../config/escrow'
import { supabase } from '../config/supabase_config'

const moralisApi = `https://deep-index.moralis.io/api/v2/`

const ListedItems: FC = () => {
    
    const { account, active } = useEthers()
    const [listedNfts, setListedNfts] = useState<any[]>([])
    
    useEffect(() => {
        console.log(account!)
        getListedItems()
    }, [])

    const getListedItems = async () => {
        if(account){
            console.log('Executing function')
            const url = `${moralisApi}/${account}/nft/?chain=mumbai&format=decimal`
            const res = await axios.get(url, {
                headers: {
                    'X-API-Key': 'j2jCbAIkQxWYNyfBohtGynlSHzjohwHDHOZqloZxhlblw3B5eHSztkgiLlgKCL95'
                }
            })
            let listedNftData: any[] = []
            // @ts-ignore
            const escrowNfts = res.data.result.filter((nft) => nft.token_address === DEPLOYED_ADDRESS.toLowerCase())
            console.log(escrowNfts)
            escrowNfts.forEach(async (token: any, index: any) => {
                console.log(index, token)
                const { data } = await supabase.from('CATALOG').select().eq('product_id', token.token_uri)
                if(data){
                    console.log(data[0])
                    listedNftData.push(data[0])
                }
            })
            setListedNfts(listedNftData)
        }
    }

    return(
        <Box>
            <Wrap py={4} fontFamily={'Work Sans'} justify={'normal'}>
            {
                active && account && 
                (
                    listedNfts[0] === undefined ?
                    <Heading fontFamily={'Work Sans'} color='blackAlpha.600'>You don't have any products yet.</Heading> :
                    listedNfts.map(product => {
                        return(
                            <WrapItem key={product.product_id} maxW={'64'}>
                                <Stack border={'1px'} borderColor={'blackAlpha.200'} shadow={'1px'} rounded={'xl'}>
                                    <Img src={'/product.jpg'} h={48} w={64} rounded={'xl'}/>
                                    <Stack p={2} spacing={4}>
                                        <Heading as='h2' fontWeight={'semibold'} fontSize={'md'} fontFamily={'Rubik'}>{product.name}</Heading>
                                        <Text>{product.description}</Text>
                                        <Button
                                            bgColor={'blackAlpha.900'} 
                                            color={'whiteAlpha.900'}
                                            onClick={() => {}}
                                            _hover={{ bgColor: 'gray.700', fontWeight: 'semibold' }}
                                            fontWeight={'normal'}
                                        >
                                            List NFT
                                        </Button>
                                    </Stack>
                                </Stack>
                            </WrapItem>
                        )
                    })
                )
            }
            </Wrap>
        </Box>
    )
}

export default ListedItems