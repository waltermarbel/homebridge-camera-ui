'use strict';

const Logger = require('../../lib/logger.js');

class doorbellService {

  constructor (api, accessory, cameraConfig, handler) {
    
    this.api = api;
    this.cameraConfig = cameraConfig;
    this.accessory = accessory;
    this.handler = handler;
    
    this.getService(this.accessory);

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  // Services
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  getService (accessory) {

    let service = accessory.getService(this.api.hap.Service.Doorbell);    
    let switchService = accessory.getServiceById(this.api.hap.Service.Switch, 'DoorbellTrigger');
    
    if(this.cameraConfig.doorbell){
      
      if(!service){
        Logger.info('Adding doorbell', accessory.displayName);
        service = accessory.addService(this.api.hap.Service.Doorbell, this.accessory.displayName + ' Doorbell', 'doorbell');
      }
      
    } else {
    
      if(service){  
        Logger.info('Removing doorbell', accessory.displayName);
        accessory.removeService(service);
      }
      
    }
    
    if(this.cameraConfig.switches){
      
      if(!switchService){
        Logger.info('Adding doorbell switch', accessory.displayName);
        switchService = accessory.addService(this.api.hap.Service.Switch, this.accessory.displayName + ' Doorbell Trigger', 'DoorbellTrigger');
      }
      
      switchService
        .getCharacteristic(this.api.hap.Characteristic.On)
        .onSet(state => {
          Logger.info('Doorbell ' + (state ? 'activated!' : 'deactivated!'), accessory.displayName);
          this.handler.doorbellHandler(accessory, state);
        });
      
    } else {
    
      if(switchService){  
        Logger.info('Removing doorbell switch', accessory.displayName);
        accessory.removeService(switchService);
      }
      
    }
    
  }

}

module.exports = doorbellService;
