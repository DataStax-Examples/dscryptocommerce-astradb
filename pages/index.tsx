import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import {useEthers} from '@usedapp/core'
import type {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next'
import {useEffect, useState} from 'react'
import {v4} from 'uuid'
import {ethers} from 'ethers'
import {ABI, DEPLOYED_ADDRESS} from '../config/escrow'
import {getProducts} from "./api/astradb";
import axios from 'axios'
import Link from 'next/link'

import AWS from 'aws-sdk'
import product_id from "./[product_id]";

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_REGION;
const ASTRA_URL = process.env.NEXT_PUBLIC_ASTRA_DB_URL;

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRETACESSKEY
})

const myBucket = new AWS.S3({
  params: {Bucket: S3_BUCKET},
  region: REGION,
})

const weiMultiplier = ethers.BigNumber.from("10").pow(18)

const Home: NextPage<{ products: string[] }> = (props) => {
  const {account, activateBrowserWallet, active, chainId, library} = useEthers()
  // const [ myCatalog, setMyCatalog ] = useState<any[]>([])
  const {onOpen, onClose, isOpen} = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0);
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File>()
  const ASTRA_URL = process.env.NEXT_PUBLIC_ASTRA_DB_URL;
  const ASTRA_SESSION_URL = `${process.env.NEXT_PUBLIC_ASTRA_DB_URL}/activity_stream/`
  const dateTime = new Date().toISOString();
  const headers = {
    'X-Cassandra-Token': `${process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  const addProductToDraft = async () => {
    setIsLoading(true)
    console.log('Add Product to Draft')
    const uid = v4()
    const url = `${ASTRA_URL}/catalog/`
    console.log(url)
    const data = await axios.post(url, {
      "name": name,
      "description": description,
      "price": price,
      "product_status": "DRAFT",
      "product_id": uid,
      "seller_address": account
    }, {
      headers: headers
    });

    const params: any = {
      ACL: 'public-read',
      Body: image,
      Key: `${uid}.jpeg`
    };

    const err = myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        if (err) console.log(err)
      })
    console.log(err)
    setIsLoading(false)
    onClose()
    window.location.href = `/${uid}`
    console.log(data)
  }

  const listNft = async (productId: string) => {
    const price = '0.2'
    const price_in_wei = ethers.utils.parseEther(price)
    const signer = library?.getSigner()
    const contract = new ethers.Contract(DEPLOYED_ADDRESS, ABI, signer)
    const listNft = await contract.listNft(price_in_wei, productId, {
      value: price_in_wei.div('4')
    })
    console.log(listNft)
  }


  // const trackConnectSession = async (dateTime: string, account: string, productId: string, session_message: string=" ", url: string) => {
  //
  //     // await activateBrowserWallet();
  //     console.log("Account: " + account);
  //     const session_request = await axios.post(url, {
  //         "timestamp": dateTime,
  //         "wallet_address": account,
  //         "product_id": productId,
  //         "action": session_message
  //     },{
  //         headers: headers
  //     });
  //     console.log(account + ' tracked!')
  //  }

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
          active && account &&
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
          // onClick={() => {!active ? trackConnectSession(dateTime, account, "null", "Connect Metamask Clicked", ASTRA_SESSION_URL) : onOpen()}}
          onClick={() => {
            !active ? activateBrowserWallet() : onOpen()
          }}
        >
          {
            active ? 'Create Product' : 'Connect Metamask'
          }
        </Button>
      </HStack>
      <Wrap px={16} py={4} fontFamily={'Work Sans'} justify={'normal'}>
        {
          active && account &&
          props &&
          props.products.map((product: any) => {
            return (
              <WrapItem key={product.product_id} maxW={'64'}>
                <Stack border={'1px'} borderColor={'blackAlpha.200'} shadow={'1px'} rounded={'xl'}>
                  <Link href={`/${product.product_id}`}>
                    <Heading as='h2' color={'blue.600'} fontWeight={'semibold'} fontSize={'lg'}
                             fontFamily={'Rubik'}>{product.name}</Heading>
                  </Link>
                  <Text>{product.description}</Text>
                  <Text>{product.price} USD</Text>

                  <Button>
                    <Link href={`/${product.product_id}`}>
                      <a>
                        <Img
                          src={`${process.env.NEXT_PUBLIC_AWS_S3!}${product.product_id}.jpeg`}
                          h={48} w={64} rounded={'xl'}/>
                      </a>
                    </Link>
                    <Stack p={2} spacing={4}>
                      <Link href={`/${product.product_id}`}>
                        <a>
                          <Heading as='h2' color={'blue.600'} fontWeight={'semibold'}
                                   fontSize={'lg'} fontFamily={'Rubik'}>{product.name}</Heading>
                        </a>
                      </Link>
                      <Text><strong>Description:</strong><br/> {product.description}</Text>
                      <Text><strong>Price:</strong> {product.price} USD</Text>
                      <Text>
                        <strong>Status:</strong>
                      </Text>
                      <Text><strong>Description:</strong><br/> {product.description}</Text>
                      <Text><strong>Price:</strong> {product.price} USD</Text>
                      <Text>
                        <strong>Status:</strong> {
                        product.product_status === 'DRAFT' ?
                          'List as NFT' : product.product_status
                      }
                      </Text>
                    </Stack>
                  </Button>
                </Stack>
              </WrapItem>
            )
          })
        }
      </Wrap>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent fontFamily={'Work Sans'}>
          <ModalHeader>Add Product</ModalHeader>
          <ModalBody>
            <Stack>
              <FormControl isRequired>
                <FormLabel htmlFor='title'>Title</FormLabel>
                <Input id='title' placeholder='Title' value={name} onChange={(e) => setName(e.target.value)}/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor='price'>Price(in $)</FormLabel>
                <Input id='price' placeholder='Price' type={'number'} value={price}
                       onChange={(e) => setPrice(e.target.value)}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='desc'>Description</FormLabel>
                <Textarea id='desc' placeholder='Description' value={description}
                          onChange={(e) => setDescription(e.target.value)}/>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='image'>Upload Image</FormLabel>
                <Input id='image' placeholder='Description' type='file'
                       onChange={(e) => setImage(e.target.files![0])}/>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={addProductToDraft} isLoading={isLoading}>
                Add to Draft
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Home

export async function getServerSideProps(
  {
    preview = false
  }
) {
  const products = (await getProducts());
  return {
    props: {products}
  };
}