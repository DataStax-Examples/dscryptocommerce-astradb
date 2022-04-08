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
import {ABI, RINKBEY_ADDRESS, POLYGON_ADDRESS} from '../config/escrow'
import {getProducts} from "./api/astradb";
import axios from 'axios'
import Link from 'next/link'

import AWS from 'aws-sdk'
import {PutObjectRequest} from "aws-sdk/clients/s3";

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_REGION;
const ASTRA_URL = process.env.NEXT_PUBLIC_ASTRA_DB_URL;

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRETACESSKEY
})
const s3 = new AWS.S3()

let DEPLOYED_ADDRESS = ''

const NETWORK = process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK

if (NETWORK === "Rinkeby") {
  DEPLOYED_ADDRESS = RINKBEY_ADDRESS
} else {
  DEPLOYED_ADDRESS = POLYGON_ADDRESS
}

const weiMultiplier = ethers.BigNumber.from("10").pow(18)

const Home: NextPage<{ products: string[] }> = (props) => {
  const {account, activateBrowserWallet, active, chainId, library} = useEthers()
  // const [ myCatalog, setMyCatalog ] = useState<any[]>([])
  const {onOpen, onClose, isOpen} = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState('');
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File>()
  const ASTRA_URL = process.env.NEXT_PUBLIC_ASTRA_DB_URL;

  const addProductToDraft = async () => {
    setIsLoading(true)
    const uid = v4()
    const url = `${ASTRA_URL}/catalog/`
    const data = await axios.post(url, {
      "name": name,
      "description": description,
      "price": price,
      "product_status": "DRAFT",
      "product_id": uid,
      "seller_address": account
    }, {
      headers: {
        // @ts-ignore
        'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }

    });
    const params: PutObjectRequest = {
      Bucket: S3_BUCKET ?? '',
      Key: `${uid}.jpeg`,
      Body: image,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    await s3.putObject(params).promise();
    setIsLoading(false)
    onClose()
    window.location.href = `/${uid}`
  }

  const listNft = async (productId: string) => {
    const price = '0.2'
    const price_in_wei = ethers.utils.parseEther(price)
    const signer = library?.getSigner()
    const contract = new ethers.Contract(DEPLOYED_ADDRESS, ABI, signer)
    const listNft = await contract.listNft(price_in_wei, productId, {
      value: price_in_wei.div('4')
    })
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
          onClick={() => {
            !active ? activateBrowserWallet() : onOpen()
          }}
        >
          {
            active ? 'Create Product' : 'Connect Metamask'
          }
        </Button>
      </HStack>
      <Wrap fontFamily={'Work Sans'} justify={'normal'} px={16} py={4}>
        {
          active && account &&
          (
            props &&
            props.products.map((product: any) => {
              return (

                <WrapItem key={product.product_id} maxW={'64'} m={'50px'}>

                  <Stack border={'1px'} borderColor={'blackAlpha.200'} shadow={'1px'} rounded={'xl'}>
                    <Link href={`/${product.product_id}`}>
                      <a><Img
                        src={`${process.env.NEXT_PUBLIC_AWS_S3!}${product.product_id}.jpeg`} h={48} w={64}
                        rounded={'xl'}/>
                      </a></Link>
                    <Stack p={2} spacing={4}>

                      <Link href={`/${product.product_id}`}>
                        <a>
                          <Heading as='h2' color={'blue.600'} fontWeight={'semibold'} fontSize={'lg'}
                                   fontFamily={'Rubik'}>{product.name}</Heading>
                        </a>
                      </Link>
                      <Text><strong>Description:</strong><br/> {product.description}</Text>
                      <Text><strong>Price:</strong> {product.price} USD</Text>
                      <Text>
                        <strong>Status:</strong> {
                        product.product_status === 'DRAFT' ?
                          'List as NFT' : product.product_status
                      }
                      </Text>
                    </Stack>
                  </Stack>
                </WrapItem>
              )
            })
          )
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
                <Input id='image' placeholder='Description' type='file' onChange={(e) => setImage(e.target.files![0])}/>
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

export async function getServerSideProps({preview = false}) {
  const products = (await getProducts());
  return {
    props: {products}
  };
}
