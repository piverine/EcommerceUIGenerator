'use client';

import {Button} from '@/components/ui/button';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {generateProductDisplay} from '@/ai/flows/generate-product-display';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useRef} from 'react';
import {Skeleton} from "@/components/ui/skeleton";

// Define the CarouselImage schema
const CarouselImageSchema = z.object({
  url: z.string().url({message: 'Please enter a valid URL'}),
});

// Define the Product schema
const ProductSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Please enter a valid price.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  image: z.string().url({message: 'Please enter a valid URL'}),
});

// Define the form schema
const formSchema = z.object({
  carouselImages: z.array(CarouselImageSchema),
  products: z.array(ProductSchema),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
    message: 'Please enter a valid hex color code.',
  }),
  secondaryColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
    message: 'Please enter a valid hex color code.',
  }),
  font: z.string().min(1, {
    message: 'Please enter a font name.',
  }),
  textPrompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
});

type CarouselImage = z.infer<typeof CarouselImageSchema>;
type Product = z.infer<typeof ProductSchema>;

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#533b54');

  // State for managing carousel images
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([{url: 'https://picsum.photos/400/300'}]);

  // State for managing product details
  const [products, setProducts] = useState<Product[]>([
    {
      title: 'Product 1',
      price: '29.99',
      description: 'A short description of product 1',
      image: 'https://picsum.photos/200/150',
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carouselImages: [{url: 'https://picsum.photos/400/300'}],
      products: [
        {
          title: 'Product 1',
          price: '29.99',
          description: 'A short description of product 1',
          image: 'https://picsum.photos/200/150',
        },
      ],
      primaryColor: '#000000',
      secondaryColor: '#533b54',
      font: 'Arial',
      textPrompt: 'Create an awesome homepage for ecommerce website with animation and cool gradient',
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {handleSubmit, watch} = form;

  // Add carousel image
   const addCarouselImage = () => {
     setCarouselImages([...carouselImages, {url: 'https://picsum.photos/400/300'}]);
   };

   // Remove carousel image
   const removeCarouselImage = (index: number) => {
     const newImages = [...carouselImages];
     newImages.splice(index, 1);
     setCarouselImages(newImages);
   };

   // Update carousel image URL
   const updateCarouselImageURL = (index: number, url: string) => {
     const newImages = [...carouselImages];
     newImages[index] = { url };
     setCarouselImages(newImages);
   };

   // Add product
   const addProduct = () => {
     setProducts([
       ...products,
       {
         title: '',
         price: '',
         description: '',
         image: '',
       },
     ]);
   };

   // Remove product
   const removeProduct = (index: number) => {
     const newProducts = [...products];
     newProducts.splice(index, 1);
     setProducts(newProducts);
   };

   // Update product details
   const updateProductDetails = (index: number, field: string, value: string) => {
     const newProducts = [...products];
     // Typescript being weird, had to add any
     newProducts[index] = { ...newProducts[index], [field]: value } as any;
     setProducts(newProducts);
   };


  const handleGenerateCode = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Start loading
    try {
      const result = await generateProductDisplay({
        carouselImages: values.carouselImages.map(img => img.url),
        products: values.products,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        font: values.font,
        textPrompt: values.textPrompt,
      });

      router.push(
        `/results?html=${encodeURIComponent(result.html)}&css=${encodeURIComponent(
          result.css
        )}&font=${encodeURIComponent(values.font)}&primaryColor=${encodeURIComponent(values.primaryColor)}&javascript=${encodeURIComponent(result.javascript || '')}`
      );
    } catch (error: any) {
      console.error('Error generating code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate code. Please try again.',
      });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Generate Your Product Display Section</h2>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleGenerateCode)} className="space-y-4">
                    <div>
                      <Label>Carousel Images</Label>
                      {carouselImages.map((image, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <FormField
                            control={form.control}
                            name={`carouselImages.${index}.url` as const}
                            render={({field}) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="Carousel Image URL"
                                    {...field}
                                    onChange={(e) => {
                                      updateCarouselImageURL(index, e.target.value);
                                      field.onChange(e); // Notify formik
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter the URL of the image for the carousel.
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeCarouselImage(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" size="sm" onClick={addCarouselImage}>
                        Add Carousel Image
                      </Button>
                    </div>

                    <div>
                      <Label>Product Details</Label>
                      {products.map((product, index) => (
                        <div key={index} className="mb-4 border p-4 rounded">
                          <h3 className="text-lg font-semibold mb-2">Product {index + 1}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`products.${index}.title` as const}
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Product Title"
                                      {...field}
                                      onChange={(e) => {
                                        updateProductDetails(index, 'title', e.target.value);
                                        field.onChange(e); // Notify formik
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter the title of the product.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`products.${index}.price` as const}
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Product Price"
                                      {...field}
                                      onChange={(e) => {
                                        updateProductDetails(index, 'price', e.target.value);
                                        field.onChange(e); // Notify formik
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter the price of the product.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`products.${index}.description` as const}
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Product Description"
                                      ref={textareaRef}
                                      onChange={(e) => {
                                        updateProductDetails(index, 'description', e.target.value);
                                        field.onChange(e); // Notify formik
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter the description of the product.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`products.${index}.image` as const}
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel>Image URL</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="url"
                                      placeholder="Product Image URL"
                                      onChange={(e) => {
                                        updateProductDetails(index, 'image', e.target.value);
                                        field.onChange(e); // Notify formik
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter the URL of the product image.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeProduct(index)}>
                            Remove Product
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" size="sm" onClick={addProduct}>
                        Add Product
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <Input type="color" {...field} onChange={(e) => {
                              setPrimaryColor(e.target.value);
                              field.onChange(e);
                            }} />
                          </FormControl>
                          <FormDescription>
                            Enter the primary color code for the brand.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <FormControl>
                            <Input type="color" {...field} onChange={(e) => {
                               setSecondaryColor(e.target.value);
                               field.onChange(e);
                            }} />
                          </FormControl>
                          <FormDescription>
                            Enter the secondary color code for the brand.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="font"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Font</FormLabel>
                          <FormControl>
                            <Input placeholder="Font Name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the font name to be used in the display section.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="textPrompt"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Text Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A text prompt describing the desired product display section."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a detailed prompt to guide the AI in generating the code.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full px-4 py-3 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
                      {isLoading ? 'Generating...' : 'Generate Code'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
