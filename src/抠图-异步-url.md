
```bash
#Create a cutout task
curl -k 'https://techhk.aoscdn.com/api/tasks/visual/segmentation' \
-H 'X-API-KEY: {YOUR_API_KEY}' \
-F 'sync=0' \
-F 'image_url={IMAGE_HTTP_URL}'

#Get the cutout result
#Polling requests using the following methods 1. The polling interval is set to 1 second, 2. The polling time does not exceed 30 seconds
curl -k 'https://techhk.aoscdn.com/api/tasks/visual/segmentation/{task_id}' \
-H 'X-API-KEY: {YOUR_API_KEY}' \
```

```php
//Create a cutout task
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL,"https://techhk.aoscdn.com/api/tasks/visual/segmentation");
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      "X-API-KEY: {YOUR_API_KEY}",
      "Content-Type: multipart/form-data",
));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_POSTFIELDS, array('sync' => 0, 'image_file' => new CURLFILE("/path/to/image.jpg")));
$response = curl_exec($curl);
$result = curl_errno($curl) ? curl_error($curl) : $response;
curl_close($curl);
var_dump($result);


//Get the cutout result
//Polling requests using the following methods 1. The polling interval is set to 1 second, 2. The polling time does not exceed 30 seconds
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://techhk.aoscdn.com/api/tasks/visual/segmentation/{task_id}");
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      "X-API-KEY: {YOUR_API_KEY}",
));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($curl);
$result = curl_errno($curl) ? curl_error($curl) : $response;
curl_close($curl);

var_dump($result);
```

```java
public static void main(String[] args) throws Exception {
    String taskId = createTask();
    String dataString = pollingTaskResult(taskId);
    System.out.println(dataString);
}

private static String createTask() throws Exception {
    OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
    RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("image_url", "{IMAGE_HTTP_URL}")
            .addFormDataPart("sync", "0")
            .build();
    Request request = new Request.Builder()
            .url("https://techsz.aoscdn.com/api/tasks/visual/segmentation")
            .addHeader("X-API-KEY", "{YOUR_API_KEY}")
            .post(requestBody)
            .build();
    Response response = okHttpClient.newCall(request).execute();
    JSONObject jsonObject = new JSONObject(response.body().string());
    int status = jsonObject.optInt("status");
    if (status != 200) {
        throw new Exception(jsonObject.optString("message"));
    }
    return jsonObject.getJSONObject("data").optString("task_id");
}

private static String pollingTaskResult(String taskId) throws Exception {
    OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
    Request taskRequest = new Request.Builder()
            .url("https://techsz.aoscdn.com/api/tasks/visual/segmentation/" + taskId)
            .addHeader("X-API-KEY", "{YOUR_API_KEY}")
            .get()
            .build();
    Response taskResponse = okHttpClient.newCall(taskRequest).execute();
    JSONObject jsonObject = new JSONObject(taskResponse.body().string());
    int state = jsonObject.getJSONObject("data").optInt("state");
    if (state < 0) { // Cutout error.
        throw new Exception(jsonObject.optString("message"));
    }
    if (state == 1) { // Cutout success and get result.
        return jsonObject.getJSONObject("data").toString();
    }
    Thread.sleep(1000);
    return pollingTaskResult(taskId);
}
```

```javascript
const request = require("request");
const fs = require("fs");
const path = require('path')

const API_KEY = "{YOUR_API_KEY}";

(async function main() {
  const taskId = await createTask()
  const result = await polling(() => getTaskResult(taskId))
  console.log(`result: ${JSON.stringify(result, null, 2)}`)
})()


const polling = async (fn, delay = 1 * 1000, timeout = 30 * 1000) => {
  if (!fn) {
    throw new Error('fn is required')
  }
  try {
    const result = await fn()
    return result
  } catch (error) {
    if (error && 'data' in error) {
      throw new Error(JSON.stringify(error, null, 2))
    }
    if (timeout <= 0) {
      throw new Error('timeout')
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
    return polling(fn, delay, timeout - delay)
  }
}

function createTask() {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: "https://techsz.aoscdn.com/api/tasks/visual/segmentation",
        headers: {
          "X-API-KEY": API_KEY,
        },
        formData: {
          image_url: '{IMAGE_HTTP_URL}',
        },
        json: true
      },
      function (error, response) {
        if (response.body.data) {
          resolve(response.body.data.task_id)
        } else {
          reject(response.body)
        }
      }
    );
  })
}

function getTaskResult(taskId) {
   return new Promise((resolve, reject) => {
    request(
      {
        method: "GET",
        url: `https://techsz.aoscdn.com/api/tasks/visual/segmentation/${taskId}`,
        headers: {
          "X-API-KEY": API_KEY,
        },
        json: true
      },
      function (error, response) {
        if (!response.body.data) reject(response.body)
        const { progress, state } = response.body.data
        if (state < 0) reject(response.body)
        if (progress >= 100) resolve(response.body)
        reject(null)
      }
    );
   })
}
```

```python
import requests
import time
import os
import json

API_KEY = "{YOUR_API_KEY}"

def polling(fn, delay=1, timeout=30):
    while True:
        try:
            return fn()
        except Exception as error:
            if 'data' in str(error):
                raise Exception(json.dumps(str(error), indent=2))
            if timeout <= 0:
                raise Exception('timeout')
            time.sleep(delay)
            timeout -= delay

def create_task():
    with open(os.path.join(os.getcwd(), 'test.jpg'), 'rb') as img:
        files = {'image_file': img}
        headers = {"X-API-KEY": API_KEY}
        response = requests.post("https://techsz.aoscdn.com/api/tasks/visual/segmentation", headers=headers, files=files)
        response_body = response.json()
        if 'data' in response_body:
            return response_body['data']['task_id']
        else:
            raise Exception(response_body)

def get_task_result(task_id):
    headers = {"X-API-KEY": API_KEY}
    response = requests.get(f"https://techsz.aoscdn.com/api/tasks/visual/segmentation/{task_id}", headers=headers)
    response_body = response.json()
    if 'data' not in response_body:
        raise Exception(response_body)
    progress, state = response_body['data']['progress'], response_body['data']['state']
    if state < 0:
        raise Exception(response_body)
    if progress >= 100:
        return response_body
    else:
        raise Exception(None)

def main():
    task_id = create_task()
    result = polling(lambda: get_task_result(task_id))
    print(f"result: {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    main()
```

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

class Program
{
    public static HttpClient client = new HttpClient();
    private static string API_KEY = "{YOUR_API_KEY}";
    private static string imageUrl = "{IMAGE_HTTP_URL}";

    static async Task Main(string[] args)
    {
        try
        {
            var taskId = await CreateTask();
            var result = await Polling(() => GetTaskResult(taskId), TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(30));
            Console.WriteLine($"result: {result.ToString()}");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        Console.ReadKey();
    }

    static async Task<string> CreateTask()
    {
        var requestUrl = "https://techsz.aoscdn.com/api/tasks/visual/segmentation";
        var multipartContent = new MultipartFormDataContent();
        multipartContent.Add(new StringContent(imageUrl), "image_url");
        client.DefaultRequestHeaders.Add("X-API-KEY", API_KEY);

        var response = await client.PostAsync(requestUrl, multipartContent);
        var responseJson = JObject.Parse(await response.Content.ReadAsStringAsync());

        if (responseJson["data"] != null)
        {
            return responseJson["data"]["task_id"].ToString();
        }
        else
        {
            throw new Exception(responseJson.ToString());
        }
    }

    static async Task<JObject> GetTaskResult(string taskId)
    {
        var requestUrl = $"https://techsz.aoscdn.com/api/tasks/visual/segmentation/{taskId}";
        var response = await client.GetAsync(requestUrl);
        var responseJson = JObject.Parse(await response.Content.ReadAsStringAsync());

        if (responseJson["data"]["image"] != null)
        {
            return responseJson;
        }
        else
        {
            throw new Exception(responseJson.ToString());
        }
    }

    static async Task<JObject> Polling(Func<Task<JObject>> fn, TimeSpan delay, TimeSpan timeout)
    {
        var endTime = DateTime.Now + timeout;
        while (DateTime.Now < endTime)
        {
            try
            {
                return await fn();
            }
            catch
            {
                Console.WriteLine("polling...");
                await Task.Delay(delay);
            }
        }

        throw new Exception("timeout");
    }
}
```

```swift
import Alamofire
import Foundation

let API_KEY = "{YOUR_API_KEY}"
let BASE_URL = "https://techsz.aoscdn.com/api/tasks/visual/segmentation"

func createTask(completion: @escaping (String) -> Void) {
    let url = URL(string: BASE_URL)!
    let image = UIImage(named: "test.jpg")!
    let imageData = image.jpegData(compressionQuality: 1.0)!

    let headers: HTTPHeaders = [
        "X-API-KEY": API_KEY
    ]

    AF.upload(multipartFormData: { multipartFormData in
        multipartFormData.append(imageData, withName: "image_file", fileName: "test.jpg", mimeType: "image/jpeg")
    }, to: url, method: .post, headers: headers).responseJSON { response in
        switch response.result {
        case .success(let value):
            if let json = value as? [String: Any],
               let data = json["data"] as? [String: Any],
               let taskId = data["task_id"] as? String {
                completion(taskId)
            }
        case .failure(let error):
            print(error)
        }
    }
}

func getTaskResult(taskId: String, completion: @escaping ([String: Any]) -> Void) {
    let url = URL(string: "\(BASE_URL)/\(taskId)")!

    let headers: HTTPHeaders = [
        "X-API-KEY": API_KEY
    ]

    AF.request(url, method: .get, headers: headers).responseJSON { response in
        switch response.result {
        case .success(let value):
            if let json = value as? [String: Any] {
                completion(json)
            }
        case .failure(let error):
            print(error)
        }
    }
}
```

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "mime/multipart"
    "net/http"
    "os"
    "path/filepath"
)

const (
    APIKey  = "{YOUR_API_KEY}"
    BaseURL = "https://techsz.aoscdn.com/api/tasks/visual/segmentation"
)

func createTask() (string, error) {
    file, err := os.Open("test.jpg")
    if err != nil {
        return "", err
    }
    defer file.Close()

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, err := writer.CreateFormFile("image_file", filepath.Base("test.jpg"))
    if err != nil {
        return "", err
    }
    _, err = io.Copy(part, file)

    err = writer.Close()
    if err != nil {
        return "", err
    }

    req, err := http.NewRequest("POST", BaseURL, body)
    if err != nil {
        return "", err
    }
    req.Header.Set("Content-Type", writer.FormDataContentType())
    req.Header.Set("X-API-KEY", APIKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    respBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    var result map[string]interface{}
    json.Unmarshal(respBody, &result)

    return result["data"].(map[string]interface{})["task_id"].(string), nil
}

func getTaskResult(taskId string) (map[string]interface{}, error) {
    req, err := http.NewRequest("GET", fmt.Sprintf("%s/%s", BaseURL, taskId), nil)
    if err != nil {
        return nil, err
    }
    req.Header.Set("X-API-KEY", APIKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    respBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var result map[string]interface{}
    json.Unmarshal(respBody, &result)

    return result, nil
}

func main() {
    taskId, err := createTask()
    if err != nil {
        fmt.Println("Error creating task:", err)
        return
    }

    result, err := getTaskResult(taskId)
    if err != nil {
        fmt.Println("Error getting task result:", err)
        return
    }

    fmt.Println("Task result:", result)
}
```
