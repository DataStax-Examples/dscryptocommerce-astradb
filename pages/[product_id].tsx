import {Box, Button, Heading, HStack, Img, Stack, Text, VStack} from '@chakra-ui/react'
import {useEthers} from '@usedapp/core'
import axios from 'axios'
import {ethers} from 'ethers'
import type {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next'
import {useRouter} from 'next/router'
import {ABI, RINKBEY_ADDRESS, POLYGON_ADDRESS} from '../config/escrow'
import {getProduct} from '../utils/products'
import Link from 'next/link'

let DEPLOYED_ADDRESS = ''

const NETWORK = process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK

if (NETWORK === "Rinkeby") {
  DEPLOYED_ADDRESS = RINKBEY_ADDRESS
} else {
  DEPLOYED_ADDRESS = POLYGON_ADDRESS
}

const ProductDetails: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
                                                                                            productDetails
                                                                                          }) => {
  const {active, account, activateBrowserWallet, library} = useEthers()
  const router = useRouter()
  const {product_id} = router.query
  const signer = library?.getSigner()
  const contract = new ethers.Contract(DEPLOYED_ADDRESS, ABI, signer)
  const dateTime = new Date().toISOString();

  const processNft = async (
    productId: string,
    operation: string,
    tokenId: string = ""
  ) => {
    if (operation === "listNft") {
      const price = '0.01'
      const price_in_wei = ethers.utils.parseEther(price)
      const dummyTx = await contract.callStatic.listNft(price_in_wei, productId, {
        value: price_in_wei.div('4')
      })
      const expectedTokenId = ethers.BigNumber.from(dummyTx).toString()
      const listNftTx = await contract.listNft(price_in_wei, productId, {
        value: price_in_wei.div('4')
      })
      // Axios Track Session to API route - List NFT Clicked
      await axios.post('/api/session', {
        "timestamp": dateTime,
        "wallet_address": account,
        "product_id": productId,
        "action": "List NFT Clicked"
      });
      if (listNftTx) {
        const receipt = await listNftTx.wait()
        await axios.patch('/api/updates/updateList', {
          "id": product_id,
          "product_status": "LISTED",
          "tokenid": expectedTokenId
        });
      }
    }
    if (operation === "bidNft") {
      const price = '0.0125'
      const price_in_wei = ethers.utils.parseEther(price)
      const bidNftTx = await contract.bidNft(parseInt(tokenId), {
        value: price_in_wei,
        gasLimit: ethers.BigNumber.from('100000')
      })
      // Axios Track Session for API Route - Bid NFT Clicked
      await axios.post('/api/session', {
        "timestamp": dateTime,
        "wallet_address": account,
        "product_id": productId,
        "action": "Bid NFT Clicked"
      });
      if (bidNftTx) {
        const receipt = await bidNftTx.wait()
        if (receipt) {
          await axios.patch('/api/updates/updateBid', {
            "id": product_id,
            "product_status": "BOUGHT",
            "buyer_address": account
          });
        }
      }
    }
    if (operation === "shipNft") {
      const shipNftTx = await contract.shipNft(parseInt(tokenId), {
        gasLimit: ethers.BigNumber.from('120000')
      })
      // Axios Track Session for API Route - Ship NFT Clicked
      await axios.post('/api/session', {
        "timestamp": dateTime,
        "wallet_address": account,
        "product_id": productId,
        "action": "Ship NFT Clicked"
      });
      if (shipNftTx) {
        const receipt = await shipNftTx.wait()
        if (receipt) {
          await axios.patch('/api/updates/updateShip', {
            "id": product_id,
            "product_status": "SHIPPED",
          });
        }
      }
    }
    if (operation === "receiveNft") {
      const receiveNftTx = await contract.receiveNft(parseInt(tokenId), {
        gasLimit: ethers.BigNumber.from('100000')
      })
      // Axios Track Session for API Route - Receive NFT Clicked
      await axios.post('/api/session', {
        "timestamp": dateTime,
        "wallet_address": account,
        "product_id": productId,
        "action": "Receive NFT Clicked"
      });
      if (receiveNftTx) {
        await axios.patch('/api/updates/updateReceive', {
          "id": product_id,
          "product_status": "RECEIVED",
        });
      }
    }


  }

  return (
    <Box>
      <HStack fontFamily={'Work Sans'} px={16} py={8} align={'center'} justify={'space-between'}>
        <Link href="/">
          <Button
            rounded={'full'}
            bgColor={'blackAlpha.900'}
            color={'whiteAlpha.900'}
            _hover={{bgColor: 'gray.700', fontWeight: 'semibold'}}
            fontWeight={'normal'}
          >DS Commerce
          </Button>
        </Link>
        {
          account &&
          <Text>
            Connected as:
            <strong>
              {` ${account.slice(0, 9)}...${account.slice(-9)}`}
            </strong>
          </Text>
        }
        <Button
          rounded={'full'}
          bgColor={'blackAlpha.900'}
          color={'whiteAlpha.900'}
          _hover={{bgColor: 'gray.700', fontWeight: 'semibold'}}
          fontWeight={'normal'}
          onClick={() => {
            !active ? activateBrowserWallet() : {}
          }}
        >
          {
            account ? '' : 'Connect Metamask'
          }
        </Button>
      </HStack>
      <VStack>
        <Stack boxSize='50%' maxW='500px' boxShadow='dark-lg' p='6' mb={'100px'} rounded='md' bg='white'>
          <Text align="center" fontFamily={'Work Sans'}><strong>Product ID:</strong> {product_id}</Text>
          <Box align="center">
            <Img src={`${process.env.NEXT_PUBLIC_AWS_S3!}${product_id}.jpeg`}/>
          </Box>
          <Box align='center' bg={'white'} color={'black'}>
            <Text align={'center'}><strong>{productDetails.name}</strong></Text>
            <Text>{productDetails.description}</Text>
          </Box>

          <Box padding={'10px'}>
            <Text><strong>Listed Price: </strong>${productDetails.price}</Text>
            <Text><strong>Sold by: </strong>{productDetails.seller_address}</Text>
            <Text><strong>Bid by: </strong>{productDetails.buyer_address}</Text>
            <Text><strong>STATUS: </strong>{productDetails.product_status}</Text>
          </Box>


          <Box align="center" paddingBottom={'10px'}>
            {(() => {
              switch (productDetails.product_status) {
                case 'DRAFT':
                  return (
                    <Button onClick={() => processNft(
                      productDetails.product_id,
                      "listNft")}>
                      List as NFT
                    </Button>
                  )

                case 'LISTED':
                  return (
                    <Button onClick={
                      () => processNft(
                        productDetails.product_id,
                        "bidNft",
                        productDetails.tokenid,)
                    }>
                      Bid on NFT
                    </Button>
                  )

                case 'BOUGHT':
                  return (
                    <Button onClick={() => processNft(
                      productDetails.product_id,
                      "shipNft",
                      productDetails.tokenid)}>
                      Ship NFT
                    </Button>
                  )

                case 'SHIPPED':
                  return (
                    <Button onClick={() => processNft(
                      productDetails.product_id,
                      "receiveNft",
                      productDetails.tokenid)}>
                      Receive NFT
                    </Button>
                  )

                case 'RECEIVED':
                  return (
                    <Heading fontFamily={'Rubik'}>Deal closed.</Heading>
                  )
              }
            })()}
          </Box>
        </Stack>
      </VStack>
    </Box>
  )
}

export default ProductDetails

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id: string = context.params!.product_id ?? '';
  const product = await getProduct(id);
  return {
    props: {
      productDetails: product![0]
    }
  };
}
