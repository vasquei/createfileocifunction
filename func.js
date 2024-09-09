const fdk=require('@fnproject/fdk');
const os = require("oci-objectstorage");
const common = require("oci-common");

fdk.handle(async function(input){

  //Set Oracle Object Storage Details
  try{
      console.log(input);
      const namespace = 'idcci5ks1puo';
      const region = 'sa-vinhedo-1'; 
      let bucketName = 'data';
      let objectName = 'empty.txt';
      let fileMessage = 'Empty!'

      if (input.objectName) {
        objectName = input.objectName;
      }

      if (input.bucketName){
        bucketName = input.bucketName;
      }

      if (input.fileMessage){
        fileMessage = input.fileMessage;
      }

      const configurationFilePath = "config";
      const configProfile = "DEFAULT";
      const provider = new common.ConfigFileAuthenticationDetailsProvider(
      configurationFilePath,
      configProfile
      );
      
	  //console.log('Created config session!!');
      
      const client = new os.ObjectStorageClient({authenticationDetailsProvider: provider});
      client.regionId = region;

      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        objectName: objectName,
	      putObjectBody: generateStreamFromString(fileMessage) 
        //putObjectBody: common.Readable.from(fileMessage)
        //contentLength: Buffer.from(fileMessage).length,
        //contentMD5: common.util.computeMD5(Buffer.from(fileMessage)),
      };
     // console.log('Object request = '+putObjectRequest.putObjectBody);
      const response = await client.putObject(putObjectRequest);  
      //const response = objectStorageClient.putObject(putObjectRequest);
      //console.log('Object uploaded:', response.headers['opc-request-id']);
     // console.log('\nresponse = '+response);
      return {'message': 'Bucket Name: ' + bucketName+' - FileName: '+objectName+ ' \nMessage: '+fileMessage}
    }catch (error) { 
      console.error('Error uploading to Object Storage:', error);
    }
})


function generateStreamFromString(data) {
  let Readable = require("stream").Readable;
  let stream = new Readable();
  stream.push(data); // the string you want
  stream.push(null);
  return stream;
}

