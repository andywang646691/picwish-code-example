
```bash
curl -k 'https://techsz.aoscdn.com/api/tasks/visual/segmentation' \
-H 'X-API-KEY: {YOUR_API_KEY}' \
-F 'sync=1' \
-F 'image_url={IMAGE_HTTP_URL}'
```

```php
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://techsz.aoscdn.com/api/tasks/visual/segmentation');
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
"X-API-KEY: {YOUR_API_KEY}",
"Content-Type: multipart/form-data",
));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_POSTFIELDS, array('sync' => 1, 'image_file' => new CURLFILE("/path/to/image.jpg")));
$response = curl_exec($curl);
$result = curl_errno($curl) ? curl_error($curl) : $response;
curl_close($curl);
var_dump($result);
```

```java
OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
RequestBody requestBody = new MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("image_url", "{IMAGE_HTTP_URL}")
        .addFormDataPart("sync", "1")
        .build();
Request request = new Request.Builder()
        .url("https://techsz.aoscdn.com/api/tasks/visual/segmentation")
        .addHeader("X-API-KEY", "{YOUR_API_KEY}")
        .post(requestBody)
        .build();
Response response = okHttpClient.newCall(request).execute();
```

```javascript
const request = require("request");

request(
  {
    method: "POST",
    url: "https://techsz.aoscdn.com/api/tasks/visual/segmentation",
    headers: {
      "X-API-KEY": "{YOUR_API_KEY}",
    },
    formData: {
      sync: "1",
      image_url: "{IMAGE_HTTP_URL}",
    },
    json: true
  },
  function (error, response) {
    if (response.body.data) {
      const { progress, state } = response.body.data
      if (progress >= 100) {
        return console.log(`result:`, response.body);
      }
    }
    throw new Error(JSON.stringify(response.body, null, 2))
  }
);
```

```python
import requests
import os

headers = {
  "X-API-KEY": "{YOUR_API_KEY}",
}

data = {
  'sync': '1'
}

files = {
  'image_url': '{IMAGE_HTTP_URL}'
}

response = requests.post("https://techsz.aoscdn.com/api/tasks/visual/segmentation", headers=headers, data=data, files=files)

if response.status_code == 200:
  response_data = response.json()
  if 'data' in response_data:
    progress = response_data['data'].get('progress')
    state = response_data['data'].get('state')
    if progress >= 100:
      print(f"result: {response_data}")
else:
  print(f"Error: {response.content}")
```

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        string apiKey = "{YOUR_API_KEY}";
        string url = "https://techsz.aoscdn.com/api/tasks/visual/segmentation";
        string imageUrl = "{IMAGE_HTTP_URL}";
        string sync = "1";

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("X-API-KEY", apiKey);

            using (var content = new MultipartFormDataContent())
            {
                content.Add(new StringContent(sync), "sync");
                content.Add(new StringContent(imageUrl), "image_url");

                var response = await client.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var responseData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseContent);
                    var progress = (int)responseData.data.progress;
                    var state = (string)responseData.data.state;

                    if (progress >= 100)
                    {
                        Console.WriteLine($"result: {responseContent}");
                    }
                }
                else
                {
                    Console.WriteLine($"Error: {responseContent}");
                }
            }
        }
        Console.ReadKey();
    }
}
```

```swift
import Alamofire
import Foundation

let apiKey = "{YOUR_API_KEY}"
let url = "https://techsz.aoscdn.com/api/tasks/visual/segmentation"
let imagePath = Bundle.main.path(forResource: "test", ofType: "jpg")!
let sync = "1"

let headers: HTTPHeaders = [
    "X-API-KEY": apiKey,
]

let imageData = try! Data(contentsOf: URL(fileURLWithPath: imagePath))

AF.upload(multipartFormData: { multipartFormData in
    multipartFormData.append(Data(sync.utf8), withName: "sync")
    multipartFormData.append(imageData, withName: "image_file", fileName: "test.jpg", mimeType: "image/jpeg")
}, to: url, method: .post, headers: headers).responseJSON { response in
    switch response.result {
    case .success(let value):
        if let jsonResponse = value as? [String: Any],
            let data = jsonResponse["data"] as? [String: Any],
            let progress = data["progress"] as? Int,
            let state = data["state"] as? String {
            if progress >= 100 {
                print("Result: \(jsonResponse)")
            }
        }
    case .failure(let error):
        print("Error: \(error.localizedDescription)")
    }
}

```

```go
package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	apiKey := "{YOUR_API_KEY}"
	url := "https://techsz.aoscdn.com/api/tasks/visual/segmentation"
	imagePath := "./test.jpg"
	sync := "1"

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	_ = writer.WriteField("sync", sync)

	file, err := os.Open(imagePath)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	defer file.Close()

	part, err := writer.CreateFormFile("image_file", filepath.Base(imagePath))
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	io.Copy(part, file)

	writer.Close()

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	req.Header.Set("X-API-KEY", apiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusOK {
		fmt.Println("Successfully uploaded the image")
	} else {
		fmt.Println("Failed to upload the image:", res.Status)
	}
}
```
