import { Box, Button, Heading, Img, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { ABI, DEPLOYED_ADDRESS } from '../config/escrow'
import { supabase } from '../config/supabase_config'

const DraftItems: FC = () => {
    
    const { account, active, library } = useEthers()
    const [myCatalog, setMyCatalog] = useState<any[]>([])

    useEffect(() => {
        fetchCatalog()
    }, [])

    const fetchCatalog = async () => {
        console.log(`Fetching catalog`)
        const { data, error } = await supabase.from('CATALOG').select().eq('listed_by', account)
        setMyCatalog(data!)
    }

    const listNft = async (productId: string) => {
        const price = '0.1'
        const price_in_wei = ethers.utils.parseEther(price)
        const signer = library?.getSigner()
        const contract = new ethers.Contract(DEPLOYED_ADDRESS, ABI, signer)
        const listNft = await contract.listNft(price_in_wei, productId, {
            value: price_in_wei.div('4')
        })
        console.log(listNft)
    }

    return(
        <Box>
            <Wrap py={4} fontFamily={'Work Sans'} justify={'normal'}>
            {
                active && account && 
                (
                    myCatalog[0] === undefined ?
                    <Heading fontFamily={'Work Sans'} color='blackAlpha.600'>You don't have any products yet.</Heading> :
                    myCatalog.map(product => {
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
                                            onClick={() => listNft(product.product_id)}
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

export default DraftItems