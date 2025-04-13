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

  const {handleSubmit} = form;

  // Add carousel image
  const addCarouselImage = () => {
    setCarouselImages([...carouselImages, {url: ''}]);
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
    newImages[index] = {url};
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
    newProducts[index] = {...newProducts[index], [field]: value} as any;
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
      console.log('Generated code:', result);

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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate Your Product Display Section</h2>
      <Card>
        <CardHeader>
          <CardTitle>Input Details</CardTitle>
          <CardDescription>Enter the details to generate your product display section.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(handleGenerateCode)} className="space-y-4">
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
                              value={image.url}
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
                                value={product.title}
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
                                {...field}
                                value={product.price}
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
                                {...field}
                                value={product.description}
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
                                {...field}
                                value={product.image}
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
                      <Input type="color" defaultValue="#000000" {...field} />
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
                      <Input type="color" defaultValue="#533b54" {...field} />
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
                      <Input placeholder="Font Name" defaultValue="Arial" {...field} />
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
